class Ladder extends AdditionalObject{
	constructor(par){
		super(par);
		var size = this.par.size;
		
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			sectType: this.par.sectType,
			h: this.par.h,
			b: this.par.b,
			stairAmt: this.par.stairAmt,
			turnAngle: this.par.turnAngle,
			offsetIn: this.par.offsetIn,
			sectLen: this.par.sectLen,
			sectWidth: this.par.sectWidth,
			sectWidthS: this.par.sectWidthS,
			sectThk: this.par.sectThk,
			cutSide: this.par.cutSide,
			marshType: this.par.marshType,
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			M: this.par.M
		};

		//общие параметры
		sectParams.material = this.material;

		if(sectParams.sectType == "марш") sectParams = drawConcreteMarsh(sectParams);
		if(sectParams.sectType == "поворот") sectParams = drawConcreteTurn(sectParams);
		if(sectParams.sectType == "площадка") sectParams = drawConcretePlatform(sectParams);

		this.add(sectParams.mesh);
	}

	static getMeta(){
		return {
			title: 'Лестница',
			inputs: [
				{
					key: 'h',
					title: 'Подъем',
					default: 180,
					type: 'number'
				},
				{
					key: 'b',
					title: 'Проступь',
					default: 260,
					type: 'number'
				},
				{
					key: 'stairAmt',
					title: 'Количество ступеней',
					default: 5,
					type: 'number'
				},
				{
					key: 'turnAngle',
					title: 'Угол поворота',
					default: 90,
					type: 'number'
				},
				{
					key: 'offsetIn',
					title: 'Отсутп поворота от центра',
					default: 0,
					type: 'number'
				},
				{
					key: 'sectLen',
					title: 'Длина секции',
					default: 1000,
					type: 'number'
				},
				{
					key: 'sectWidth',
					title: 'Ширина секции',
					default: 900,
					type: 'number'
				},
				{
					key: 'sectThk',
					title: 'Толщина секции',
					default: 200,
					type: 'number'
				},
				{
					key: 'M',
					title: 'Ширина марша',
					default: 900,
					type: 'number'
				},
				{
					key: 'marshType',
					title: 'Тип марша',
					default: 'пилообразный',
					values: [
						{
							value: 'пилообразный',
							title: 'Пилообразный'
						},
						{
							value: 'ломаный',
							title: 'Ломаный'
						}
					],
					type: 'select'
				},
				{
					key: 'sectType',
					title: 'Тип секции',
					default: 'марш',
					values: [
						{
							value: 'марш',
							title: 'Марш'
						},
						{
							value: 'поворот',
							title: 'Поворот'
						},
						{
							value: 'площадка',
							title: 'Площадка'
						}
					],
					type: 'select'
				},

				{
					key: 'sectWidthS',
					title: 'Ширина секции по большей стороне (для выреза площадки)',
					default: 900,
					type: 'number'
				},
				{
					key: 'cutSide',
					title: 'Сторона выреза (для площадки)',
					default: 'справа',
					values: [
						{
							value: 'справа',
							title: 'Справа'
						},
						{
							value: 'слева',
							title: 'Слева'
						},
						{
							value: 'две',
							title: 'Две'
						}
					],
					type: 'select'
				},
			]
		}
	}
}



function drawConcreteMarsh(par){

	par.M = par.sectWidth;
	par.mesh = new THREE.Object3D();
	var shape = new THREE.Shape();
	//var dxfBasePoint = { "x": 0.0, "y": 0.0 };
	//ступени
	var points = [];
	var point = { "x": 0.0, "y": 0.0 };
	points.push(point)
	
	for (var i = 0; i < par.stairAmt; i++) {		
		point = newPoint_xy(point, 0, par.h*1.0);
		points.push(point)
		point = newPoint_xy(point, par.b*1.0, 0);
		points.push(point) 
		};
	var botLineP1 = points[points.length - 1]
	
	if(par.marshType == "пилообразный"){
		//Точки на нижней линии
		var botLine = parallel(points[0], points[2], -par.sectThk*1.0);
//		console.log(botLineP1, botLine)
		//верхняя точка
		var point = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), botLine.p1, botLine.p2);
		points.push(point)
		
		//нижняя точка
		var point = itercection(points[0], newPoint_xy(points[0], 100, 0), botLine.p1, botLine.p2);
		points.push(point)
		}
		
	if(par.marshType == "ломаный"){
		point = newPoint_xy(botLineP1, 0, -par.sectThk*1.0);
		points.push(point)
		point = newPoint_xy(point, -(par.b - par.sectThk), 0);
		points.push(point)
		
		for (var i = 0; i < par.stairAmt-2; i++) {	
			point = newPoint_xy(point, 0, -par.h*1.0);
			points.push(point) 
			point = newPoint_xy(point, -par.b*1.0, 0);
			points.push(point)			
			};
		point = newPoint_xy(points[0], par.b * 1.0 + par.sectThk * 1.0, 0);
		points.push(point);	
		}
	
	for (var i = 0; i < points.length; i++) {		
		if(i < points.length-1)
		addLine(shape, dxfPrimitivesArr, points[i], points[i+1], par.dxfBasePoint);
		if(i == points.length-1)
			addLine(shape, dxfPrimitivesArr, points[i], points[0], par.dxfBasePoint);
		};
		
	var extrudeOptions = {
        amount: par.M,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var marsh = new THREE.Mesh(geom, par.material);
	par.mesh.add(marsh) 
    
//	console.log(par)
	
	return par;
		

}//end of drawMarsh

function drawConcreteTurn(par){
	
	var turnFactor = 1;
    if(par.turnAngle < 0) {
		turnFactor = -1;
	}
	
	par.mesh = new THREE.Object3D();
	var stepAngle = par.turnAngle * Math.PI / 180 / par.stairAmt * turnFactor;
	var treadParams = {
		startAngle: 0,
		endAngle: 0,
		offsetIn: par.offsetIn * 1.0, 
		turnAngle: par.turnAngle * Math.PI / 180 * turnFactor,
		marshWidth1: par.sectWidth * 1.0,
		marshWidth2: par.sectLen * 1.0,
		turnFactor: turnFactor,
		dxfArr: par.dxfArr,
		dxfBasePoint: {x:0, y:0},
		material: par.material,
		thk: 300,
	}

	for(var i=0; i<par.stairAmt; i++){
		treadParams.startAngle = stepAngle * i;
		treadParams.endAngle = stepAngle * (i + 1);
		treadParams = drawTurnStep(treadParams)
		var tread = treadParams.mesh;
		tread.rotation.x = -Math.PI / 2;
		tread.position.y = par.h * (i + 1) - treadParams.thk;
		tread.position.z = treadParams.offsetIn;
		par.mesh.add(tread);
	}

	return par;
}//end of drawTurn

function drawTurnStep(par){
	var halfAngle = par.turnAngle / 2;
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shape = new THREE.Shape();
	var p0 = {x:0, y:0};
	
	var p2 = {x: par.offsetIn*Math.cos(par.turnAngle/2), y: par.offsetIn*Math.sin(par.turnAngle/2)*par.turnFactor};
    var p3 = newPoint_xy(p0, par.offsetIn*Math.cos(par.turnAngle/2)*Math.cos(par.turnAngle),par.offsetIn*Math.cos(par.turnAngle/2)*Math.sin(par.turnAngle)*par.turnFactor);
    var p4 = {x: p2.x, y: 0};	
    var p5 = {x:(par.marshWidth2 + distance(p0, p3))*Math.sin(Math.PI/2-par.turnAngle), y:(par.marshWidth2 + distance(p0, p3))*Math.cos(Math.PI/2-par.turnAngle)*par.turnFactor};
    var p6 = {x:(par.marshWidth1 + p4.x), y:0};
    var p1 = {x:(par.marshWidth1 + p4.x), y: p5.y - ((par.marshWidth1 + p4.x) - p5.x)/Math.tan(par.turnAngle) * par.turnFactor};
	
	var angleP1 = Math.atan(Math.abs(p1.y)/p1.x);
	
	if(par.startAngle >= halfAngle){
		var ps0 = newPoint_xy(p0, 100*Math.cos(par.startAngle), 100*Math.sin(par.startAngle)*par.turnFactor);
		var pe0 = newPoint_xy(p0, 100*Math.cos(par.endAngle), 100*Math.sin(par.endAngle)*par.turnFactor);
		
		var ps1 = itercection(p0, ps0, p1, p5);
		var pe1 = itercection(p0, pe0, p1, p5);
		
		var ps2 = itercection(p0, ps0, p2, p3);
		var pe2 = itercection(p0, pe0, p2, p3);
		
		if(angleP1 > par.endAngle){
			ps1 = itercection(p0, ps0, p1, p6);
			pe1 = itercection(p0, pe0, p1, p6);
			
		    addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else if(angleP1 < par.endAngle && angleP1 > par.startAngle){
			ps1 = itercection(p0, ps0, p1, p6);
			
		    addLine(shape, par.dxfArr, ps1, p1, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, p1, pe1, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else{
		    addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
	}
	else if(par.endAngle > halfAngle){
		var ps0 = newPoint_xy(p0, 100*Math.cos(par.startAngle), 100*Math.sin(par.startAngle)*par.turnFactor);
		var pe0 = newPoint_xy(p0, 100*Math.cos(par.endAngle), 100*Math.sin(par.endAngle)*par.turnFactor);
		
		var ps1 = itercection(p0, ps0, p1, p6);
		var pe1 = itercection(p0, pe0, p1, p5);
		
		var ps2 = itercection(p0, ps0, p2, p4);
		var pe2 = itercection(p0, pe0, p2, p3);
		
		if(angleP1 < par.endAngle && angleP1 > par.startAngle){
	        addLine(shape, par.dxfArr, ps1, p1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p1, pe1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe2, p2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p2, ps2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else if(angleP1 < par.startAngle){
			ps1 = itercection(p0, ps0, p1, p5);
			addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe2, p2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p2, ps2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else{
			pe1 = itercection(p0, pe0, p1, p6);
	        addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe2, p2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p2, ps2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
	}
	else{
		var ps0 = newPoint_xy(p0, 100*Math.cos(par.startAngle), 100*Math.sin(par.startAngle)*par.turnFactor);
		var pe0 = newPoint_xy(p0, 100*Math.cos(par.endAngle), 100*Math.sin(par.endAngle)*par.turnFactor);
		
		var ps1 = itercection(p0, ps0, p1, p6);
		var pe1 = itercection(p0, pe0, p1, p6);
		
		var ps2 = itercection(p0, ps0, p2, p4);
		var pe2 = itercection(p0, pe0, p2, p4);
		
		if(angleP1 < par.startAngle){
			ps1 = itercection(p0, ps0, p1, p5);
			pe1 = itercection(p0, pe0, p1, p5);
			
		    addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else if(angleP1 < par.endAngle && angleP1 > par.startAngle){
			pe1 = itercection(p0, pe0, p1, p5);
			
	        addLine(shape, par.dxfArr, ps1, p1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p1, pe1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
		else{
	        addLine(shape, par.dxfArr, ps1, pe1, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe1, pe2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, pe2, ps2, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, ps2, ps1, par.dxfBasePoint);
		}
	}

	geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, par.material);
	par.mesh = mesh;
	
	return par;
}

function drawConcretePlatform(par){
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.sectWidth = par.sectWidth * 1.0;
	par.sectWidthS = par.sectWidthS * 1.0;
	par.sectLen = par.sectLen * 1.0;
	
	var treadThickness = par.sectThk;
	var extrudeOptions = {
		amount: treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
	
	var deltaWidth = par.sectWidth - par.sectWidthS
	
	var shape = new THREE.Shape();
	var p0 = {x:0, y:0};
	var p1 = newPoint_xy(p0, par.sectWidth, 0);
	if(par.cutSide == "справа") var p2 = newPoint_xy(p1, -deltaWidth, par.sectLen);
	if(par.cutSide == "слева") var p2 = newPoint_xy(p1, 0, par.sectLen);
	if(par.cutSide == "две") var p2 = newPoint_xy(p1, -deltaWidth/2, par.sectLen);
	var p3 = newPoint_xy(p2, -par.sectWidthS, 0);
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);
	
	//console.log(par)
	// console.log(p0, p1, p2, p3);
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var tread = new THREE.Mesh(geom, par.material);
	tread.rotation.x = -Math.PI / 2;
	tread.rotation.z = -Math.PI / 2;
	tread.position.y = -treadThickness;
	//tread.position.z = par.sectWidth / 2;
	par.mesh.add(tread);


	return par;
}//end of drawPlatform
