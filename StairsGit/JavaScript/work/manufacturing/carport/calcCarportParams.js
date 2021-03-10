/** функция устанав

profTypes


/** функция возвращает сечения элементов полученные на основании прочностных расчетов
названия элементов кровли на русском 6692035.ru/drawings/carport/roof_parts_rus.jpg
названия элементов кровли на английском 6692035.ru/drawings/carport/roof_parts_eng.jpg
названия элементов фермы на английском 6692035.ru/drawings/carport/truss_parts.jpg
все профили со стенкой 3мм
*/


function setCarportProfs(){
	
	if (params.sectLen > 3000 && params.carportType !== "четырехскатный" && params.beamModel != "ферма постоянной ширины"){
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
	if(params.roofMat == "металлочерепица") progonProf = "40х40"
	$("#progonProf").val(progonProf)
	
	//параметры навеса с стропилами из проф. трубы
	
	var beamProf = "80х40";
	var beamProf2 = "60х60";
	var columnProf = "60х60";
	
	if(params.beamModel == "проф. труба"){
		//макс. шаг стропил 700мм - уточнить арочный или плоский
		if(params.width <= 2000) {
			beamProf = "40х40"
			if(params.sectLen <= 2000){
				beamProf2 = "60х40"
				columnProf = "60х60"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "60х60"
				columnProf = "60х60"
			}
			if(params.sectLen > 3000){
				beamProf2 = "80х80"
				columnProf = "60х60"
			}			
		}
		
		if(params.width > 2000) {
			beamProf = "60х40"
			if(params.sectLen <= 2000){
				beamProf2 = "60х40"
				columnProf = "60х60"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "60х60"
				columnProf = "60х60"
			}
			if(params.sectLen > 3000){
				beamProf2 = "80х80"
				columnProf = "60х60"
			}			
		}
		
		if(params.width > 3000) {
			beamProf = "60х40"
			if(params.sectLen <= 2000){
				beamProf2 = "60х40"
				columnProf = "60х60"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "60х60"
				columnProf = "60х60"
			}
			if(params.sectLen > 3000){
				beamProf2 = "80х80"
				columnProf = "60х60"
			}			
		}
		
		if(params.width > 3500) {
			beamProf = "60х40"
			if(params.sectLen <= 2000){
				beamProf2 = "60х60"
				columnProf = "60х60"
			}
			if(params.sectLen > 2000){
				beamProf2 = "60х60"
				columnProf = "80х80"
			}
			if(params.sectLen > 3000){
				beamProf2 = "80х80"
				columnProf = "80х80"
			}			
		}
		
		if(params.width > 4000) {
			beamProf = "80х40"
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"
			}
			if(params.sectLen > 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"
			}
			if(params.sectLen > 3000){
				beamProf2 = "100х100"
				columnProf = "100х100"
			}			
		}
		
		if(params.width > 4500) {
			beamProf = "80х40"
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "80х80"
				columnProf = "100х100"
			}
			if(params.sectLen > 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
			}			
		}
		
		
		if(params.width > 5000) {
			beamProf = "100х50"
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "100х100"
				columnProf = "100х100"
			}
			if(params.sectLen > 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
			}			
		}
		
		if(params.width > 6000) {
			beamProf = "100х50"
			if(params.sectLen <= 2000){
				beamProf2 = "100х100"
				columnProf = "100х100"				
			}
			if(params.sectLen > 2000){
				beamProf2 = "120х120"
				columnProf = "120х120"
			}
			if(params.sectLen > 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
			}			
		}
		
		if(params.carportType == "многогранник") {
			beamProf = "40х20"
			if(params.domeDiam > 3000) beamProf = "60х30"
			if(params.domeDiam > 4000) beamProf = "80х40"
			if(params.domeDiam > 5000) beamProf = "100х50"
			columnProf = "80х80"
		}
		
		if(params.carportType == "купол"){
			beamProf = "40х40"
			if(params.domeDiam > 5000) beamProf = "60х40"
		}
		
		
		$("#beamProf").val(beamProf)
		$("#beamProf2").val(beamProf2)
		$("#columnProf").val(columnProf)
	}
	
	

	//толщина фермы
	var trussThk = 4;
	if(params.width >= 5000) trussThk = 8;
	$("#trussThk").val(trussThk)
	
	//высота в середине фермы
	var midHeight = 250
	
	if(params.roofType == "Арочная") {
		midHeight = 250
		if(params.beamModel == "сужающаяся"){			
			if(params.width > 3900) midHeight = 300
			if(params.width > 4900) midHeight = 400
			if(params.width > 5900) midHeight = 450
			
			if(params.carportType == "односкатный") midHeight *= 1.1;
		}
		
		if(params.beamModel == "постоянной ширины"){
			if(params.width > 3900) midHeight = 250
			if(params.width > 4900) midHeight = 300
			if(params.width > 5900) midHeight = 350
		}
	}
	
	if(params.roofType == "Плоская") {
		midHeight = 350
		if(params.beamModel == "сужающаяся"){
			if(params.width > 3900) midHeight = 400
			if(params.width > 4900) midHeight = 500
			if(params.width > 5900) midHeight = 550
			midHeight *= 1 / Math.cos(params.roofAng / 180 * Math.PI);
			midHeight = Math.round(midHeight)
		}
		if(params.beamModel == "постоянной ширины"){
			midHeight = 230
			if(params.width > 3900) midHeight = 250
			if(params.width > 4900) midHeight = 300
			if(params.width > 5900) midHeight = 350
		}
	}
	
	$("#trussHeight").val(midHeight)
	
	
	//высота фермы над колонной
	
	var endHeight = 200;
	if(params.width > 4900) endHeight = 250;

	
	if(params.beamModel == "ферма постоянной ширины") {		
		endHeight = Math.floor(params.width/100) * 10; //формула подогнана		
		if(endHeight < 200) endHeight = 200;		
	}
	
	$("#trussHeightEnd").val(endHeight)
	
	
	//пояса и раскосы сварных ферм из профиля
	var chordProf = "40х40"
	var webProf = "20х20"
	
	//нагрузка на одну ферму в тоннах
	var load = params.sectLen * params.width / 1000000 * 0.18;
	
	//приблизительные параметры фермы в зависимости от нагрузки. Надо перепроверить прочностным расчетом
	if(load > 1.5) {
		chordProf = "60х60"
		webProf = "40х40"
	}
	if(load > 3) {
		chordProf = "80х80"
		webProf = "40х40"
	}
	
	if(load > 5) {
		chordProf = "100х100"
		webProf = "60х60"
	}
	
	//сечение полосы фермы
	if(params.beamModel == "сужающаяся" || params.beamModel == "постоянной ширины"){
		chordProf = "40х4"
		if(params.width > 3900) chordProf = "60х4"
		if(params.width > 4900) chordProf = "80х5"
		if(params.width > 5900) chordProf = "100х6"
		if(params.width > 6900) chordProf = "100х10"
	}
	
	
	$("#chordProf").val(chordProf)
	$("#webProf").val(webProf)
	
	
	//шаг прогонов
	var progonMaxStep = 800;
	if(params.roofMat == "металлочерепица") progonMaxStep = 350;
	if(params.beamModel == "проф. труба" && params.roofMat.indexOf("поликарбонат") != -1) progonMaxStep = 3000;
	$("#progonMaxStep").val(progonMaxStep)
	
	//шаг балок
	var beamMaxStep = params.sectLen;
	if(params.trussType == "балки") {
		beamMaxStep = 2100 / 3;
		if(params.beamModel != "проф. труба") beamMaxStep = 2100;
	}
	$("#beamMaxStep").val(beamMaxStep)
	
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
		movableSections: {},
		dome: {},
		rail: {}, //рельсы для сдвижного навеса
	}

	par.main.roofAng = params.roofAng / 180 * Math.PI;

	//общая длина навеса
	par.main.len = params.sectAmt * params.sectLen + params.frontOffset + params.backOffset;
	par.main.width = params.width / Math.cos(par.main.roofAng); //длина вдоль ската кровли
	



	//стропила
	
	par.rafter = {
		profSize: {
			x: 4,
			y: 4,
		},
		amt: params.sectAmt + 1,
	}
	
	if(params.beamModel == "проф. труба") {
		var rafterProfPar = getProfParams(params.beamProf);
		par.rafter = {
			profSize: {
				x: rafterProfPar.sizeB,
				y: rafterProfPar.sizeA,
			}
		}
	}
	
	if(params.trussType == "балки"){
		par.rafter.amt = Math.ceil(par.main.len / params.beamMaxStep) + 1;	
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
	
	//ширина навеса по осям колонн
	par.main.colDist = params.width - params.sideOffset * 2 - par.column.profSize.x;
	if(params.carportType == "односкатный") par.main.colDist = params.width - params.sideOffset - params.sideOffsetTop - par.column.profSize.x;

	
	//продольные балки
	par.beam = {
		profSize: {
			x: columnProfPar.sizeB,
			y: columnProfPar.sizeA,
		},
		holeDist: 180 - 60,
	}
	
	if(params.trussType != "балки"){
		par.beam = {
			profSize: {
				x: 60,
				y: 180,
			},
			holeDist: 180 - 60,
		}
	}
	
	//фермы
	par.truss = {
		thk: params.trussThk,
		stripeThk: 4,
		width: 200,
		endPoint: {x:0, y:0}, //точка перезаписывается при отрисовке фермы
		sideWidth: 30, //Отступ отверстия от края
		bridgeWidth: 40, //минимальная ширина перемычки между отверстиями
		midHeight: params.trussHeight, //высота в центре фермы
		endHeight: params.trussHeightEnd, //высота фермы над колонной
	}

	//параметры отвертсий для ферм из листа
	if(params.width > 1200){
		par.truss.sideWidth = 40
		par.truss.bridgeWidth = 60
	}
	if(params.width > 2100){
		par.truss.sideWidth = 60
		par.truss.bridgeWidth = 80
	}
	if(params.width > 4900){
		par.truss.sideWidth = 80
		par.truss.bridgeWidth = 100
	}
	
	//Раскосы фермы
	var webProfPar = getProfParams(params.webProf);
	par.truss.web = {
		profSize: {
			x: webProfPar.sizeB,
			y: webProfPar.sizeA,
		}
	}
	
	//пояса фермы
	var chordProfPar = getProfParams(params.chordProf);
	par.truss.chord = {
		profSize: {
			x: chordProfPar.sizeB,
			y: chordProfPar.sizeA,
		}
	}
	
	par.truss.stripeThk = chordProfPar.sizeB

	//прогоны
	var purlinProfPar = getProfParams(params.progonProf);
	par.purlin = {
		profSize: {
			x: purlinProfPar.sizeB,
			y: purlinProfPar.sizeA,
		}
	}
	par.purlin.maxStep = 800;
	if(params.roofMat == "металлочерепица") par.purlin.maxStep = 350;
	if(params.beamModel == "проф. труба") par.purlin.maxStep = 3000;
	par.purlin.amt = Math.ceil(par.main.width / par.purlin.maxStep) + 1;
	
	if(params.roofType != "Арочная"){
		//кол-во прогонов на одном скате
		var rafterLen = params.width / Math.cos(params.roofAng / 180 * Math.PI)
		if(params.carportType == "двухскатный") rafterLen *= 0.5;
		par.purlin.amt = Math.ceil(rafterLen / par.purlin.maxStep) + 1;
	}
	
	//шаг по горизонтали для плоской кровли
	par.purlin.holeStepX = (params.width - par.purlin.profSize.x) / (par.purlin.amt - 1);
	
	//листы кровли
	par.roofSheet.overhang = 50;
	
	
	//верхняя дуга
	
	var arcPar = {
		a1: (params.roofAng + 90) / 180 * Math.PI, //угол вектора на центр внешней дуги и точку p1
		sideOffset: 80, //расстояние от нулевой точки к точке botLine.p2
		columnProf: par.column.profSize,
		endHeight: par.truss.endHeight,
		midHeight: par.truss.midHeight,
	}
	
	if(params.beamModel == "проф. труба"){
		arcPar.beamHeight = par.rafter.profSize.y
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
	
	//кол-во сдвигаемых прямоугольного навеса для бассейна
	par.movableSections = {
		left: params.sectAmt,
	}
	//сдвиг в две стороны
	if(params.sectAmt > 3) par.movableSections.left = Math.ceil(params.sectAmt / 2)
		
	//параметры круглого павильона
	par.dome = {
		overlayAng: 2, //угол нахлеста секции
		doorOffset: 82,
		arcFixLen: 120, //длина участка крепления дуги к верхнему фланцу
		topFlanDiam: 500,
		tubeDiam: 26.8,
		baseThk: 8, //толщина листа основания
		weelBlockHeight: 60, //полная высота ролика с кронштейном от верха рельса до верха кронштейна
		baseStripe: {x: 4, y: 40}, //ребро на основании
	}
	
	//рельсы для сдвижного навеса
	par.rail = {
		profSize: {
			x: 20,
			y: 20,
		},
		stripe: {
			x: 40,
			y: 4,
		}
	}

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
				p1: newPoint_xy(p0, 0, partPar.beam.profSize.y),
				p2: newPoint_xy(p0, 1, partPar.beam.profSize.y),
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
	var holeOffset = 30;
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
	
	//смещаем левое верхнее отверстие
	if(distance(holes[0], holes[1]) > partPar.beam.holeDist || par.isTop) holes[1] = newPoint_xy(holes[0], 0, partPar.beam.holeDist);
	

	//смещаем правое верхнее отверстие
	holes[2] = newPoint_xy(holes[3], 0, partPar.beam.holeDist);

	par.lines = lines
	par.points = points
	par.holes = holes
	par.holeDiam = 12 + 3
	par.holeOffset = holeOffset
	par.thk = 8
	par.width = distance(points.p1, points.p4)
	
	return par;
}