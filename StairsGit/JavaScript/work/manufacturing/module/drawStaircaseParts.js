function drawMarsh(par){
	//console.log(par)
	
	var x0 = par.a / 2;
	var y0 = 0;
	var z0 = 0;
	var turnModuleStep = par.turnModuleStep;
	var marshNumber = par.marshNumber;

	
/*** СТУПЕНИ ***/

	spec.treads[marshNumber] = 0;
	
	var geometry = new THREE.BoxGeometry(par.a, par.treadThickness, par.M);
	var tread;
	for (var i = 0; i < par.stairAmt; i++) {
		tread = new THREE.Mesh(geometry, par.treadMaterial);
		tread.position.y = y0 + (par.h * (i + 1) - par.treadThickness / 2);
		tread.position.x = x0 + par.b * i;
		tread.position.z = par.M / 2//* turnFactor;
		par.treads.add(tread);
		spec.treads[marshNumber] += 1;
		}
		
	//Площадка
	
	spec.plt[marshNumber] = 0;
	
	if(par.topEnd == "platform") {
		var geometry = new THREE.BoxGeometry(par.M, par.treadThickness, par.M);
		var platform = new THREE.Mesh(geometry, par.treadMaterial);
			platform.position.y = y0 + (par.h * (i + 1) - par.treadThickness / 2);
			platform.position.x = par.M/2 + par.b * par.stairAmt; 
			platform.position.z = par.M / 2;
			par.treads.add(platform);
			spec.plt[marshNumber] += 1;
		}
	//забежные ступени
	
	spec.wndTreads[marshNumber] = 0;
	if(par.topEnd == "winder") {
		//задаем параметры блока забежных ступеней 
		turnParams = {
			model: "module",
			stairModel: "Г-образная с забегом",
			marshDist: params.marshDist,
			M: par.M,
			h: par.h1,
			treadThickness: par.treadThickness,
			stringerThickness: 0,
			treadSideOffset: 0,
			material: par.treadMaterial,
			turnFactor: par.turnFactor,
			dxfBasePoint: {x:0, y:0}
			}

			
		//отрисовываем блок забежных ступеней 	
		var turnSteps = drawTurnSteps(turnParams); //функция в файле drawCarcasPartsLib.js;
		turnSteps.meshes.rotation.y = -0.5 * Math.PI; // * turnFactor;
		turnSteps.meshes.position.x = par.stairAmt * par.b;
		turnSteps.meshes.position.y = (par.stairAmt + 1) * par.h - par.treadThickness//par.treadThickness / 2 * par.turnFactor + par.h + y0 - par.treadThickness * ((1 + par.turnFactor) * 0.5);
		turnSteps.meshes.position.z = z0 + par.M //* par.turnFactor;
		if(par.turnFactor == -1) turnSteps.meshes.position.z = z0
		turnSteps.meshes.castShadow = true;
		par.treads.add(turnSteps.meshes);
		spec.wndTreads[marshNumber] += 3;
	}
	
	
/*** КАРКАС ***/

	spec.module[marshNumber] = 0;
	
	//нижний модуль
	
	var moduleParams = {
		rise: par.h - par.treadThickness,
		step: par.b,
		type: "bottom",
		marshNumber: marshNumber,
		material: par.carcasMaterial,
		dxfBasePoint: {x:0, y:0},
		dxfPrimitivesArr: dxfPrimitivesArr,
		}
	var moduleAmt = par.stairAmt;
	if(par.botEnd != "floor"){
		moduleParams.rise = par.h;
		moduleParams.type = "middle";
		}

	if(par.stairAmt > 1){
		moduleParams = drawModule(moduleParams);
		var module = moduleParams.mesh;			
			module.position.y = 0;
			if(par.botEnd != "floor") module.position.y = -par.treadThickness;
			module.position.z = par.M/2;
			module.position.x = par.a / 2;
			
		par.carcas.add(module);
		
		//сохраняем позицию нижнего модуля
		var x0 = module.position.x;
		var z0 = module.position.z;
		
		
		//средние модули
		
		moduleParams.rise = par.h;
		moduleParams.step = par.b;
		moduleParams.type = "middle";
		
		var modAmt = par.stairAmt - 1;
		//if(par.botEnd != "floor") modAmt += 1;
		//if(par.topEnd == "platform") modAmt += 1;
		if(par.topEnd == "winder") modAmt += 1;
		
		

		for (var i=1; i < modAmt; i++){
			moduleParams = drawModule(moduleParams);
			var module = moduleParams.mesh;
				module.position.x = x0 + par.b * i;
				module.position.y = par.h * i - par.treadThickness;
				module.position.z = z0;
			par.carcas.add(module);
			}
		
		//задаем привязка для верхнего модуля
		if(par.stairAmt != 0){	
			x0 = module.position.x;
			y0 = module.position.y;
			}
		
	}//end of par.stairAmt > 1
	
	
	if(par.stairAmt == 0){
		x0 = -(par.a - par.b) //- par.b;
		y0 = - par.h - par.treadThickness;
		z0 = par.M/2;
		}

	//марш с одной ступенью
	if(par.stairAmt == 1){
		y0 = - par.treadThickness;
		z0 = par.M/2;

		//нижний марш
		if(par.botEnd == "floor"){
			moduleParams.rise = par.h - par.treadThickness;
			moduleParams.type = "bottom";
			
			moduleParams = drawModule(moduleParams);
			var module = moduleParams.mesh;			
				module.position.y = 0;
				module.position.z = z0;
				module.position.x = par.a / 2;
				
			par.carcas.add(module);
			
			
			moduleParams.rise = par.h;		
			}
		//средний марш
		if(par.botEnd != "floor" && par.topEnd != "floor"){ 
			
			moduleParams = drawModule(moduleParams);
			var module = moduleParams.mesh;			
				module.position.y = y0;
				module.position.z = z0;
				module.position.x = par.a / 2;
				
			par.carcas.add(module);
		
			}
		
		//верхний марш
		if(par.topEnd == "floor"){
			x0 -= par.b;
			y0 -= par.h;
			
			}
	}
	
//верх косоура

//перекрытие
	if(par.topEnd == "floor"){
		moduleParams.type = "top";
		moduleParams = drawModule(moduleParams);
		var module = moduleParams.mesh;
			module.position.x = x0 + par.b;
			if(par.stairAmt == 0) module.position.x = par.M/2 + 100 + params.marshDist
			module.position.y = y0 + par.h;
			module.position.z = z0;
		par.carcas.add(module);
		}
	

//площадка
	if(par.topEnd == "platform"){
		moduleParams.type = "middle";
		moduleParams.step = turnModuleStep;
		
		//первый модуль площадки
		moduleParams = drawModule(moduleParams);
		var module = moduleParams.mesh;
			module.position.x = x0 + par.b;
			module.position.y = y0 + par.h;
			module.position.z = z0;
			module.rotation.y = 0;//-Math.PI/2 * turnFactor
		par.carcas.add(module);	
		
		//второй модуль площадки
		moduleParams = drawModule(moduleParams);
		var module = moduleParams.mesh;
			module.position.x = x0 + + par.b + moduleParams.step;
			module.position.y = y0 + par.h * 2;
			module.position.z = z0;
			module.rotation.y = -Math.PI/2 * turnFactor
		par.carcas.add(module);	
		}
		
//забег
	if (par.topEnd == "winder") {
		moduleParams.type = "middle";
		moduleParams.rise = par.h;
		var ang1 = 25.6244/ 180 * Math.PI ; //Угол поворота модуля снят с модели 
		var ang2 = 64.3968/ 180 * Math.PI;
		var ang3 = Math.PI/2;
		
		//модуль 1 забежной ступени
		if(par.botEnd == "floor" && par.stairAmt == 0){
			moduleParams.type = "bottom";
			moduleParams.rise = par.h - par.treadThickness;
			}		
		moduleParams = drawModule(moduleParams);
		var module1 = moduleParams.mesh;
			module1.rotation.y = -ang1 * turnFactor
			module1.position.x = x0 + par.b // + moduleParams.step;
			module1.position.y = y0 + par.h;
			if(par.botEnd == "floor" && par.stairAmt == 0) module1.position.y += par.treadThickness;
			module1.position.z = z0;			
		par.carcas.add(module1);
		
		//модуль 2 забежной ступени
		moduleParams.type = "middle";
		moduleParams.rise = par.h;
		moduleParams = drawModule(moduleParams);
		var module2 = moduleParams.mesh;
			module2.rotation.y = -ang2 * turnFactor;
			module2.position.x = module1.position.x + moduleParams.step * Math.cos(ang1);
			module2.position.y = y0 + par.h * 2;
			module2.position.z = module1.position.z + moduleParams.step * Math.sin(ang1) * turnFactor;
			
		par.carcas.add(module2);
		
		//модуль 3 забежной ступени
		if(params.stairAmt3 == 0) moduleParams.type = "top";
		moduleParams = drawModule(moduleParams);
		var module3 = moduleParams.mesh;
			module3.position.x = module2.position.x + moduleParams.step * Math.cos(ang2);
			module3.position.y = y0 + par.h * 3;
			module3.position.z = module2.position.z + + moduleParams.step * Math.sin(ang2) * turnFactor;
			module3.rotation.y = -ang3 * turnFactor
		par.carcas.add(module3);
	}

	
/*** БОЛЬЦЫ ***/
	
	var height = par.h - par.treadThickness;
	var bolzRad = par.bolzSize / 2;
	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;
	var geom = new THREE.CylinderGeometry( bolzRad, bolzRad, height, radialSegments, heightSegments, openEnded) 
	var x0 = (par.a - par.b) / 2;
	var z0 = (par.a - par.b) / 2;
	var bolzStepAmt = par.stairAmt;
	if(par.topEnd != "floor") bolzStepAmt += 1;
	
	spec.bolz[marshNumber] = 0;
	
	if(par.bolzSide == "внешняя" || par.bolzSide == "две стороны"){

		//больцы на марше
		for (var i = 0; i < bolzStepAmt; i++) {
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);	
				bolz.position.x= x0 + par.b * i;
				bolz.position.y= height/2 + par.h * i;
				bolz.position.z= z0;
				if(turnFactor == -1) bolz.position.z = par.M - z0;
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
			}
		//больцы на забеге
		if(par.topEnd == "winder"){
			var bolzOffset = turnSteps.params[1].stepWidthHi - 110;
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);	
				bolz.position.x= x0 + par.b * (bolzStepAmt - 1) + bolzOffset;
				bolz.position.y= height/2 + par.h * bolzStepAmt;
				bolz.position.z= z0;
				if(turnFactor == -1) bolz.position.z = par.M - z0;
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
			
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);
				var bolzOffset = turnSteps.params[2].stepWidthX - 70;
				bolz.position.x= -x0 + par.b * (bolzStepAmt - 1) + par.M;
				bolz.position.y= height/2 + par.h * (bolzStepAmt + 1);
				bolz.position.z= z0 + bolzOffset;
				if(turnFactor == -1) bolz.position.z = par.M - z0 - bolzOffset;
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
		
			}
		
		}
	if(par.bolzSide == "внутренняя" || par.bolzSide == "две стороны"){
		//больцы на марше
		for (var i = 0; i < bolzStepAmt; i++) {
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);	
				bolz.position.x= x0 + par.b * i;
				bolz.position.y= height/2 + par.h * i;
				bolz.position.z= par.M - z0;
				if(turnFactor == -1) bolz.position.z= z0;
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
			}
		//больцы на забеге
		if(par.topEnd == "winder"){
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);	
				bolz.position.x= x0 + par.b * (bolzStepAmt - 1);
				bolz.position.y= height/2 + par.h * bolzStepAmt;
				bolz.position.z= par.M - z0;
				if(turnFactor == -1) bolz.position.z= z0;
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
			
			var bolz = new THREE.Mesh(geom, par.carcasMaterial);	
				bolz.position.x= x0 + par.b * (bolzStepAmt - 1);
				bolz.position.y= height/2 + par.h * (bolzStepAmt + 1);
				bolz.position.z= par.M - z0;
				if(turnFactor == -1) bolz.position.z= z0;				
			par.bolz.add(bolz);
			spec.bolz[marshNumber] += 1;
		
			}
		
		}
	

/*** ОГРАЖДЕНИЯ ***/

if(par.railingModel == "Редкие стойки" || par.railingModel == "Частые стойки"){
	
	var height = 1100;
	var height1 = height - par.h / 2;
	var balRad = par.bolzSize / 2;
	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;
	var geom = new THREE.CylinderGeometry( balRad, balRad, height, radialSegments, heightSegments, openEnded) 
	var geom1 = new THREE.CylinderGeometry( balRad, balRad, height1, radialSegments, heightSegments, openEnded) 
	var x0 = (par.a - par.b) / 2;
	var z0 = (par.a - par.b) / 2;
	if(par.turnFactor == -1) z0 = par.M - z0;
	var balStepAmt = par.stairAmt;
	if(par.topEnd != "floor") balStepAmt += 1;
	
	spec.banister[marshNumber] = 0;
	spec.handrail[marshNumber] = [];
	
	/* внешнее ограждение кроме внешнего ограждения забега*/
	
	
	if(par.railingSide == "внешнее" || par.railingSide == "две"){

		//нижний поворота
		
		if(par.botEnd == "platform"){
			//рассчитываем кол-во стоек
			var balAmt = Math.round((par.M - x0 * 2) / par.b)
			if(par.railingModel == "Частые стойки") balAmt = Math.round((par.M - x0 * 2) / (par.b / 2))
			var balDst = (par.M - x0 * 2) / balAmt;
			for (var i = 0; i < balAmt; i++) {
				var bal0 = new THREE.Mesh(geom1, par.carcasMaterial);	
				bal0.position.x = balDst * (i+1) - par.M;
				bal0.position.y = height1/2; // + par.h * (balStepAmt);
				bal0.position.z = z0; //bal.position.z;
				par.railing.add(bal0);
				spec.banister[marshNumber] += 1;
				}	
			}
		
		//стойки на забеге
		if(par.botEnd == "winder"){
			//рассчитываем кол-во стоек
			var balAmt = Math.round((par.M - x0 * 2) / par.b)
			if(par.railingModel == "Частые стойки") balAmt = Math.round((par.M - x0 * 2) / (par.b / 2))
			var balDst_x = (par.M - x0 * 2) / balAmt;
			var balDst_y = par.h / balAmt;
			for (var i = 0; i < balAmt; i++) {
				var bal0 = new THREE.Mesh(geom1, par.carcasMaterial);	
				bal0.position.x = balDst_x * (i+1) - par.M;
				bal0.position.y = height1/2 - par.h + balDst_y * (i+1);
				bal0.position.z = z0; //bal.position.z;
				par.railing.add(bal0);
				spec.banister[marshNumber] += 1;
				}	
		
			}
		
		//марш
		
		for (var i = 0; i < balStepAmt; i++) {
			//длинные стойки
			var bal = new THREE.Mesh(geom, par.carcasMaterial);	
				bal.position.x= x0 + par.b * i;
				bal.position.y= height/2 + par.h * i;
				bal.position.z= z0;
				//if(turnFactor == -1) bal.position.z = par.M - z0;
			par.railing.add(bal);
			spec.banister[marshNumber] += 1;
			//сохраняем точку для поручня
			var lastBalPos = {
				x: bal.position.x,
				y: bal.position.y + height/2,
				z: bal.position.z,
				}
			var posZ = bal.position.z; 
			
			//короткие стойки
			if(par.railingModel == "Частые стойки"){
				var bal1 = new THREE.Mesh(geom1, par.carcasMaterial);	
					bal1.position.x= bal.position.x + par.b / 2;
					bal1.position.y= height1/2 + par.h * (i+1);
					bal1.position.z= bal.position.z;
				par.railing.add(bal1);
				spec.banister[marshNumber] += 1;
				}
			}
		
		
		//верхний поворот
		
		if(par.topEnd == "platform"){
			//рассчитываем кол-во стоек
			var balAmt = Math.round((par.M - x0 * 2) / par.b)
			if(par.railingModel == "Частые стойки") balAmt = Math.round((par.M - x0 * 2) / (par.b / 2))
			var balDst = (par.M - x0 * 2) / balAmt;
			for (var i = 0; i < balAmt; i++) {
				var bal1 = new THREE.Mesh(geom1, par.carcasMaterial);	
				bal1.position.x= bal.position.x + balDst * (i+1);
				bal1.position.y= height1/2 + par.h * (balStepAmt);
				bal1.position.z= z0;
				par.railing.add(bal1);
				spec.banister[marshNumber] += 1;
				}	
			}
		
		//стойки на забеге
		if(par.topEnd == "winder"){		
			//рассчитываем кол-во стоек
			var balAmt = Math.round((par.M - x0 * 2) / par.b)
			if(par.railingModel == "Частые стойки") balAmt = Math.round((par.M - x0 * 2) / (par.b / 2))
			var balDst_x = (par.M - x0 * 2) / balAmt;
			var balDst_y = par.h / balAmt;
			for (var i = 0; i < balAmt; i++) {
				var bal = new THREE.Mesh(geom1, par.carcasMaterial);	
				bal.position.x= lastBalPos.x + balDst_x * (i+1);
				bal.position.y= height/2 + par.h * (balStepAmt) + balDst_y * (i+1);;
				bal.position.z= z0;
				par.railing.add(bal);
				spec.banister[marshNumber] += 1;
				}	
		
			}
			
			//поручень
			
			
			var handrailParams = {
				poleType: "round",
				poleProfileY: 50,
				poleProfileZ: 50,
				length: 0,
				poleAngle: 0,
				poleMaterial: par.treadMaterial,
				mesh: new THREE.Object3D(),	
				}
			
		//поручень нижнего поворота
			
			if(par.botEnd == "platform"){
				handrailParams.length = par.M - 150;
				handrailParams.poleAngle = 0;
				handrailParams.mesh = new THREE.Object3D();
				var handrailParams1 = drawHandrail(handrailParams);
				var handrail1 = handrailParams1.mesh;
				handrail1.position.x = - par.M + 150;
				handrail1.position.y = height1;
				handrail1.position.z = z0;
				par.railing.add(handrail1);
				spec.handrail[marshNumber].push(Math.round(handrailParams.length));
				}
			
			if(par.botEnd == "winder"){
				handrailParams.length = par.M - 150;
				handrailParams.poleAngle = Math.atan(par.h / par.M);
				handrailParams.mesh = new THREE.Object3D();
				var handrailParams1 = drawHandrail(handrailParams);
				var handrail1 = handrailParams1.mesh;
				handrail1.position.x = -par.M + 150;
				handrail1.position.y = height1 - par.h + 50;
				handrail1.position.z = z0;
				par.railing.add(handrail1);
				spec.handrail[marshNumber].push(Math.round(handrailParams.length));
				}
		
		
		//поручень на марше

			var poleAngle = Math.atan(par.h/par.b)
			var length = par.b/Math.cos(poleAngle) * (balStepAmt - 0.5);
			if (par.topEnd == "floor") length = par.b/Math.cos(poleAngle) * (balStepAmt);

			var handrailParams = {
				poleType: "round",
				poleProfileY: 50,
				poleProfileZ: 50,
				length: length,
				poleAngle: Math.atan(par.h/par.b),
				poleMaterial: par.treadMaterial,
				mesh: new THREE.Object3D(),	
				}
			
			handrailParams = drawHandrail(handrailParams);
			var handrail = handrailParams.mesh;
			handrail.position.y = 1060;
			handrail.position.z = z0;
			par.railing.add(handrail);
			spec.handrail[marshNumber].push(Math.round(handrailParams.length));
			
			//поручень верхнего поворота
			
			if(par.topEnd == "platform"){
				handrailParams.length = par.M - par.b/2;
				handrailParams.poleAngle = 0;
				handrailParams.mesh = new THREE.Object3D();
				var handrailParams1 = drawHandrail(handrailParams);
				var handrail1 = handrailParams1.mesh;
				handrail1.position.x = lastBalPos.x + par.b/2 - 50;
				handrail1.position.y = lastBalPos.y + par.h/2;
				handrail1.position.z = z0;
				par.railing.add(handrail1);
				spec.handrail[marshNumber].push(Math.round(handrailParams.length));
				}
			
			if(par.topEnd == "winder"){
				handrailParams.length = par.M - par.b/2;
				handrailParams.poleAngle = Math.atan(par.h / par.M);
				handrailParams.mesh = new THREE.Object3D();
				var handrailParams1 = drawHandrail(handrailParams);
				var handrail1 = handrailParams1.mesh;
				handrail1.position.x = lastBalPos.x + par.b/2 - 50;
				handrail1.position.y = lastBalPos.y + par.h - 50;
				handrail1.position.z = z0;
				par.railing.add(handrail1);
				spec.handrail[marshNumber].push(Math.round(handrailParams.length));
				}
		
		} //end of par.railingSide == "внешнее" || par.railingSide == "две"
		
	if(par.railingSide == "внешнее забег"){
		//рассчитываем кол-во стоек
			var balAmt = Math.round((par.M * 2 - 50 - x0 * 2) / par.b)
			if(par.railingModel == "Частые стойки") balAmt = Math.round((par.M * 2 - 50 - x0 * 2) / (par.b / 2))
			var balDst_x = (par.M * 2 - 50 - x0 * 2) / balAmt;
			var balDst_y = 3 * par.h / balAmt;
			for (var i = 0; i < balAmt; i++) {
				var bal0 = new THREE.Mesh(geom1, par.carcasMaterial);	
				bal0.position.x = balDst_x * (i+1) - par.M;
				bal0.position.y = height1/2 - par.h + balDst_y * (i+1);
				bal0.position.z = z0; //bal.position.z;
				par.railing.add(bal0);
				spec.banister[marshNumber] += 1;
				}
			
			var poleAngle = Math.atan((3 * par.h) / (2 * par.M - 150));
			var length = (2*par.M - 200)/Math.cos(poleAngle);
						
			var handrailParams = {
				poleType: "round",
				poleProfileY: 50,
				poleProfileZ: 50,
				length: length,
				poleAngle: poleAngle,
				poleMaterial: par.treadMaterial,
				mesh: new THREE.Object3D(),	
				}		
				//console.log(handrailParams)
				var handrailParams1 = drawHandrail(handrailParams);
				var handrail1 = handrailParams1.mesh;
				handrail1.position.x = - par.M + 150;
				handrail1.position.y = height1 - par.h + 50;
				handrail1.position.z = z0;
				par.railing.add(handrail1);
				spec.handrail[marshNumber].push(Math.round(handrailParams.length));
		
		}
		
	
	if(par.railingSide == "внутреннее" || par.railingSide == "две"){
	
		var z0 =  par.M -(par.a - par.b) / 2;
		if(par.turnFactor == -1) z0 = (par.a - par.b) / 2;
	
		//стойки на марше
		for (var i = 0; i < balStepAmt; i++) {
			var bal = new THREE.Mesh(geom, par.carcasMaterial);	
				bal.position.x= x0 + par.b * i;
				bal.position.y= height/2 + par.h * i;
				bal.position.z= z0;
				//if(turnFactor == -1) bal.position.z= z0;
			par.railing.add(bal);
			spec.banister[marshNumber] += 1;
			}
		if(par.railingModel == "Частые стойки"){
			var balStepAmt1 = balStepAmt - 1;
			if(par.topEnd == "floor") balStepAmt1 +=1;
			for (var i = 0; i < balStepAmt1; i++) {			
				var bal1 = new THREE.Mesh(geom1, par.carcasMaterial);	
					bal1.position.x= x0 + par.b * i + par.b / 2;
					bal1.position.y= height1/2 + par.h * (i+1);
					bal1.position.z= z0;
				par.railing.add(bal1);
				spec.banister[marshNumber] += 1;
				}
			}
		//стойки на забеге
		if(par.topEnd == "winder"){
			var bal = new THREE.Mesh(geom, par.carcasMaterial);	
				bal.position.x= x0 + par.b * (balStepAmt - 1);
				bal.position.y= height/2 + par.h * balStepAmt;
				bal.position.z= z0;
				//if(turnFactor == -1) bal.position.z= z0;
			par.railing.add(bal);
			spec.banister[marshNumber] += 1;
			
			var bal = new THREE.Mesh(geom, par.carcasMaterial);	
				bal.position.x= x0 + par.b * (balStepAmt - 1);
				bal.position.y= height/2 + par.h * (balStepAmt + 1);
				bal.position.z= z0;
				//if(turnFactor == -1) bal.position.z= z0;				
			par.railing.add(bal);
			spec.banister[marshNumber] += 1;
		
			}
		
		//поручень
		if(par.stairAmt != 0){
			var poleAngle = Math.atan(par.h/par.b)
			var length = par.b/Math.cos(poleAngle) * (balStepAmt - 1);
			if(par.topEnd == "floor") length = par.b/Math.cos(poleAngle) * balStepAmt;
			//console.log(length)
			
			var handrailParams = {
				poleType: "round",
				poleProfileY: 50,
				poleProfileZ: 50,
				handrailLength: 100,
				length: length,				
				poleAngle: poleAngle,
				poleMaterial: par.treadMaterial,
				mesh: new THREE.Object3D(),
				basePoint: [0,0,0],
				dxfBasePoint: {x:0, y:0},
				}
			//console.log(handrailParams)
			
			handrailParams = drawPole3D_2(handrailParams);
			var handrail = handrailParams.mesh;
			handrail.position.y = 1060;
			if(handrailParams.poleType == "round"){
				handrail.position.x += handrailParams.length / 2 * Math.cos(handrailParams.poleAngle);
				handrail.position.y += handrailParams.length / 2 * Math.sin(handrailParams.poleAngle);
				}
			handrail.position.z = z0;
			par.railing.add(handrail);
			spec.handrail[marshNumber].push(Math.round(handrailParams.length));
			}
		
		}
	
	
		
}


	return par;
} //end of drawMarsh

function drawModule(par){
	
	/*Фуниция отрисовывает модуль каркаса модульной лестницы
	исходные данные:
	rise - подъем
	step - проступь
	type - тип модуля: bottom || middle || top
	material,
	dxfBasePoint
	dxfPrimitivesArr, 
	*/
	
	par.mesh = new THREE.Object3D();

	
	//задаем параметры модуля

   var cylDiam = 127; //диаметр стаканов
   var bridgeHeight = 150; //высота перемычки Y
   var bridgeWidth = 80; //щирина перемычки Z
   var rise = par.rise;
   var step = par.step;
   var botCylLedge = 10; //выступ стакана снизу за перемычку
   var treadPlateThickness = 4; //толщина металла фланцев


	/*первый стакан*/
	var radiusTop = cylDiam / 2;
	var radiusBottom = cylDiam / 2;
	var cylHeight = rise - treadPlateThickness;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;
	var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylHeight, segmentsX, segmentsY, openEnded);
	var cyl1 = new THREE.Mesh(geometry, par.material);
	cyl1.position.x = 0;
	cyl1.position.y = cylHeight/2;
	cyl1.position.z = 0;
	par.mesh.add(cyl1);

   /*перемычка*/
	var bridgeLength = step;
	if(par.type == "bottom" && rise < bridgeHeight - 2*treadPlateThickness) {
		bridgeHeight = rise - 2*treadPlateThickness;
		botCylLedge = 0;
		}
	if(par.type == "top") bridgeLength = step - cylDiam / 2 - 6;
	var geometry = new THREE.BoxGeometry(bridgeLength, bridgeHeight, bridgeWidth);
	var exampleBox = new THREE.Mesh(geometry, par.material);
		exampleBox.position.x = bridgeLength/2;
		exampleBox.position.y = cylHeight - bridgeHeight/2;		
		exampleBox.position.z = 0;
		par.mesh.add(exampleBox);
	
	/*второй стакан*/
	if(par.type != "top"){
		var cylHeight = bridgeHeight + treadPlateThickness + botCylLedge;
		var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylHeight, segmentsX, segmentsY, openEnded);
		var cyl2 = new THREE.Mesh(geometry, par.material);
		cyl2.position.x = step;
		cyl2.position.y = cylHeight/2 + rise - cylHeight;
		cyl2.position.z = 0;
		par.mesh.add(cyl2);
		}
	
	/*подложка*/
	var plateParams = {
		width: 150,
		length: 200,	
		thickness: treadPlateThickness,
		material: par.material,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: par.dxfPrimitivesArr,	
		}
	plateParams = drawModulePlate(plateParams);
	var treadPlate = plateParams.mesh;
	treadPlate.rotation.x = Math.PI/2;
	treadPlate.position.x = -plateParams.width / 2;
	treadPlate.position.y = rise;
	treadPlate.position.z = -plateParams.length / 2;
	par.mesh.add(treadPlate);
	
	
	/*нижний фланец крепления к перекрытию*/
	if(par.type == "bottom"){
		var plateParams = {
			width: 150,
			length: 200,	
			thickness: treadPlateThickness,
			material: par.material,
			dxfBasePoint: {x:0, y:0},
			dxfPrimitivesArr: dxfPrimitivesArr,	
			}
		plateParams = drawModulePlate(plateParams);
		var botFlan = plateParams.mesh;
		botFlan.rotation.x = Math.PI/2;
		botFlan.position.x = -plateParams.width / 2;
		botFlan.position.y = plateParams.thickness; 
		botFlan.position.z = -plateParams.length / 2;
		par.mesh.add(botFlan);	
		}
		
	/*верхний фланец крепления к перекрытию*/
	if(par.type == "top"){
		var plateParams = {
			width: 150,
			length: 300,	
			thickness: treadPlateThickness,
			material: par.material,
			dxfBasePoint: {x:0, y:0},
			dxfPrimitivesArr: dxfPrimitivesArr,
			}
		plateParams = drawModulePlate(plateParams);
		var botFlan = plateParams.mesh;
		botFlan.rotation.y = -Math.PI/2;
		botFlan.position.x = bridgeLength;
		botFlan.position.y = rise - bridgeHeight - 40; ; 
		botFlan.position.z = -plateParams.width / 2;
		par.mesh.add(botFlan);	
		}
		
	//дополнительные возвращаемые параметры
	par.cylDiam = cylDiam;
	if(par.type == "middle") spec.module[par.marshNumber] += 1;
	return par;
	}//end of drawModule

function drawModulePlate(par) {

    /*функция отрисовывает верхний фланец крепления к перекрытию ФК-15*/
    // var dxfBasePoint = { "x": 0.0, "y": 0.0 };
    var flanParams = {
        width: par.width,
        holeDiam: 13,
        holeDiam5: 0,
        angleRadUp: 15,
        angleRadDn: 15,
        hole1X: 20,
        hole1Y: 20,
        hole2X: 20,
        hole2Y: 20,
        hole3X: 20,
        hole3Y: 20,
        hole4X: 20,
        hole4Y: 20,
        hole5X: 0,
        hole5Y: 0,
        height: par.length,
        dxfBasePoint: par.dxfBasePoint,
        dxfPrimitivesArr: par.dxfPrimitivesArr,
    };

    //добавляем фланец
    flanParams = drawRectFlan(flanParams);
	flanParams.length = par.length;
	flanParams.thickness = par.thickness;

    var text = "Подложка ступени";
    var textHeight = 30;
    var textBasePoint = newPoint_xy(par.dxfBasePoint, -50, -250);
    addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

    var extrudeOptions = {
        amount: par.thickness,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
    };
    var geometry = new THREE.ExtrudeGeometry(flanParams.shape, extrudeOptions);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    flanParams.mesh = new THREE.Mesh(geometry, par.material);
	
	return flanParams;
}//end of drawModulePlate


function drawTurnStepsModule(par){


}

function drawColumn(par){

	par.mesh = new THREE.Object3D();

	var cylDiam = 127; //диаметр столба
	
	var radiusTop = cylDiam / 2;
	var radiusBottom = cylDiam / 2;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;
	
	if(par.type == "column") {
		var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, par.height, segmentsX, segmentsY, openEnded);
		var cyl = new THREE.Mesh(geometry, par.material);
		cyl.position.x = 0;
		cyl.position.y = par.height/2;
		cyl.position.z = 0;
		par.mesh.add(cyl);	
		
		//фланец
		var plateParams = {
			width: 250,
			length: 250,	
			thickness: 4,
			material: par.material,
			dxfBasePoint: {x:0, y:0},
			dxfPrimitivesArr: dxfPrimitivesArr,
			}
		plateParams = drawModulePlate(plateParams);
		var botFlan = plateParams.mesh;
		botFlan.rotation.x = -Math.PI/2;
		botFlan.position.x = -125;
		botFlan.position.y = 0//-par.height/2// - par.M/2 - par.h - 200;
		botFlan.position.z = 125//-par.M/2;
		//if (par.dir == "right") botFlan.position.z = -125;
		par.mesh.add(botFlan);	
		
		spec.columns[par.marshNumber].push(Math.round(par.height));
		
		}
	
	if(par.type == "console") {
		
		//вертикальный стакан
		var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, 100, segmentsX, segmentsY, openEnded);
		var cyl = new THREE.Mesh(geometry, par.material);
		cyl.position.x = 0;
		cyl.position.y = par.height - 30 - par.h;
		cyl.position.z = 0;
		par.mesh.add(cyl)
		
		//наклонная палка
		var consoleAngle = Math.PI / 4;
		var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, par.M/(2 * Math.cos(consoleAngle)), segmentsX, segmentsY, openEnded);
		var cyl = new THREE.Mesh(geometry, par.material);
		cyl.rotation.x = consoleAngle;
		cyl.position.x = 0;
		cyl.position.y = par.height - (par.M/2 * Math.tan(consoleAngle)) / 2 - 80 - par.h;
		cyl.position.z = -(par.M/2 * Math.tan(consoleAngle)) / 2;
		if (par.dir == "right") {
			cyl.rotation.x = -consoleAngle;
			cyl.position.z = (par.M/2 * Math.tan(consoleAngle)) / 2;
			}
		par.mesh.add(cyl)
		
		//фланец
		var plateParams = {
			width: 250,
			length: 250,	
			thickness: 4,
			material: par.material,
			dxfBasePoint: {x:0, y:0},
			dxfPrimitivesArr: dxfPrimitivesArr,
			}
		plateParams = drawModulePlate(plateParams);
		var botFlan = plateParams.mesh;
		//botFlan.rotation.y = Math.PI/2;
		botFlan.position.x = -125;
		botFlan.position.y = par.height - par.M/2 - par.h - 200;
		botFlan.position.z = -par.M/2;
		if (par.dir == "right") botFlan.position.z = par.M/2;
		par.mesh.add(botFlan);	
		
		spec.consoles[par.marshNumber] += 1;
		}
	
	return par;

	}
	
function setColumnPosition(stairAmt){
	var pos = [];
	
	pos[0] = [];
	pos[1] = [];
	pos[2] = [];
	pos[3] = [];
	pos[4] = [];
	pos[5] = [];
	pos[6] = [3];
	pos[7] = [4];
	pos[8] = [4];
	pos[9] = [5];
	pos[10] = [5];
	pos[11] = [4,8];
	pos[12] = [4,8];
	pos[13] = [5,9];
	pos[14] = [5,10];
	pos[15] = [5,10];
	pos[16] = [4,8,12];
	pos[17] = [4,8,12];
	pos[18] = [5,10,14];
	pos[19] = [5,10,15];
	pos[20] = [5,10,15];

	return pos[stairAmt];
	/*
	if(par.stairModel == "Прямая"){}
	if(par.stairModel == "Г-образная с площадкой"){}
	if(par.stairModel == "Г-образная с забегом"){}
	if(par.stairModel == "П-образная с площадкой"){}
	if(par.stairModel == "П-образная с забегом"){}
	if(par.stairModel == "П-образная трехмаршевая"){}
	*/

	}