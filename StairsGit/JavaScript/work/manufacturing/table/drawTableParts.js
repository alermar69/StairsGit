/** функция отрисовывает подстолье
	@param model
	@param height
	@param width
	@param len
*/

function drawTableBase(par){
	initPar(par)
	var modelPar = getTableBasePar(par);
	
	for(var i=0; i<modelPar.partsAmt; i++){
		
	//модель T-1
		if(par.model == "T-1"){
			
			var profPar = getProfParams(modelPar.legProf)
			
			var posZ = 0;
			if(i==1) posZ = par.len - profPar.sizeA
			
			
			var polePar = {
				poleProfileY: profPar.sizeB,
				poleProfileZ: profPar.sizeA,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
				length: par.height,
				poleAngle: Math.PI / 2,
			}
				
			//левая нога
			var pole1 = drawPole3D_4(polePar).mesh;
			pole1.position.x = 0;
			pole1.position.y = 0;
			pole1.position.z = posZ;
			par.mesh.add(pole1);
			
			//правая нога
			var pole1 = drawPole3D_4(polePar).mesh;
			pole1.position.x = par.width - profPar.sizeB;
			pole1.position.y = 0;
			pole1.position.z = posZ;
			par.mesh.add(pole1);
			
			//нижняя перемычка
			polePar.length = par.width - profPar.sizeB * 2
			polePar.poleAngle = 0;
			var pole3 = drawPole3D_4(polePar).mesh;
			pole3.position.x = 0;
			pole3.position.y = 0;
			pole3.position.z = posZ;
			par.mesh.add(pole3);
			
			//верхняя пластина
			var platePar = {
				width: 100,
				len: par.width,
				legProfPar: profPar,
			}
			var plate = drawTableBasePlate(platePar).mesh;
			plate.position.x = -profPar.sizeB;
			plate.position.y = par.height;
			plate.position.z = posZ;
			if(i==1) {
				plate.rotation.x = Math.PI
				plate.position.y -= platePar.thk
				plate.position.z += profPar.sizeA
			}
			par.mesh.add(plate);
		}
	}
	
	//центр в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
}


/** функция отрисовывает столешницу
	@param model
	@param thk
	@param width
	@param len
*/
function drawCountertop(par){
	initPar(par)
	
	if(par.model != "цельная") par.width = (par.width - par.partsGap) / 2;

	var p0 = {x: 0, y:0};
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.len);
	var p3 = newPoint_xy(p0, par.width, par.len);
	var p4 = newPoint_xy(p0, par.width, 0);
	
	
	
	var points = [p1, p2, p3, p4];
	
	if(par.model != "цельная"){
		points[2].filletRad = points[3].filletRad = 1
	}
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: par.cornerRad, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber);
	mesh.rotation.x = Math.PI / 2;
	par.mesh.add(mesh);

	if(par.model != "цельная"){
		var mesh = new THREE.Mesh(geom, params.materials.timber);
		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.y = Math.PI;
	//	mesh.position.y = -par.thk;
		mesh.position.x = par.width * 2+ par.partsGap;
		mesh.position.z = par.len;
		par.mesh.add(mesh);
	}
	
	//сохраняем данные для спецификации
	par.partName = "countertop";
	par.thk = params.countertopThk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Столешница",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				group: "Каркас",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk);
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
	}
	
	//центр в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
}

/** функция возвращает параметры подстолья по модели
	@param model
*/

function getTableBasePar(par){
	par.roundOnly = false; //подходит только для круглых столов
	par.partsAmt = 2; //из скольки одинаковых частей состоит
	
	var models = ["S-9", "T-17"]
	if(models.indexOf(par.model) != -1){
		par.roundOnly = true;
	}
	
	var models = ['S-1', 'S-6', 'S-9', 'T-4', 'T-6', 'T-7', 'T-9', 'T-10', 'T-12', 'T-16', 'T-17',]
	if(models.indexOf(par.model) != -1){
		par.partsAmt = 1;
	}
	
	//профили
	par.legProf = "60х30";
	if(par.width > 600) par.legProf = "80х40";
	if(par.width > 800) par.legProf = "100х40";
	
	return par;
}

/** функция отрисовывает верхнюю пластину подстолья
*/

function drawTableBasePlate(par){
	initPar(par)
	
	if(!par.thk) par.thk = 8;
	if(!par.cornerRad) par.cornerRad = 10;

	var p0 = {x: 0, y:0};
	
	//углы без учета вырезов
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.width);
	var p3 = newPoint_xy(p0, par.len, par.width);
	var p4 = newPoint_xy(p0, par.len, 0);
	
	p2.filletRad = p3.filletRad = par.cornerRad
	
	//вырезы
	var p11 = newPoint_xy(p1, par.legProfPar.sizeB, 0)
	var p12 = newPoint_xy(p1, par.legProfPar.sizeB, par.legProfPar.sizeA)
	var p13 = newPoint_xy(p1, 0, par.legProfPar.sizeA)
	
	var p41 = newPoint_xy(p4, 0, par.legProfPar.sizeA)
	var p42 = newPoint_xy(p4, -par.legProfPar.sizeB, par.legProfPar.sizeA)	
	var p43 = newPoint_xy(p4, -par.legProfPar.sizeB, 0)
	
	var points = [p11, p12, p13, p2, p3, p41, p42, p43];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
	//	radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = Math.PI / 2;
	par.mesh.add(mesh);
	
	return par;
}