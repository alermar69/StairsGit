/**
	Отрисовывает размеры лестницы

	@param {object} treadsObj - объект ступеней, нужен чтобы снять точки для рассчета размеров

	@return {mesh} mesh
*/

function draw3DDimensions(par){
	var mesh = new THREE.Object3D();
	var treadsObj = par.treadsObj;
	var offset = 100;// отступ от объекта
	var carcasOffset = 0;
	var carcasDelta = 0;
	var topHeight = params.staircaseHeight + 500;//Высота размеров при виде сверху(они должны быть над потолком для корректного отображения)
	var viewType = par.view == 'front' ? 'front' : par.view == 'top' ? 'top' : 'side';//Опередяем как мы видим вид, с боку или спереди
	var additionalParams = par.additionalParams || {};
	if (par.view == '3d') viewType = '3d';
	if (params.model == 'лт') {
		var carcasDelta = (params.M - calcTreadLen()) / 2;
		var carcasOffset = 5; //отступ в начале лестницы
	}
	if (params.model == 'тетивы' || params.model == 'тетива+косоур') {
		carcasDelta = params.stringerThickness - params.stringerSlotsDepth;
	}
	//Сюда сохраняем размеры маршей
	var firstMarshSize = 0;
	var secondMarshSize = 0;
	var thirdMarshSize = 0;

	//отступ в конце лестницы
	var offsetEnd = 0;
	if(params.topFlan == "есть") offsetEnd = 8;
	//учитываем наличие задней тетивы верхней площадки + 5мм зазор
	if(params.model == "лт" && params.platformRearStringer == "есть") offsetEnd = 8 + 5;

	if(params.topAnglePosition == "над ступенью" && params.staircaseType == "mono") offsetEnd = 8;

	if (params.calcType == 'timber') offsetEnd = 40;

	//Ширина марша
	if ((viewType == 'front' || viewType == 'top') && par.treadsObj) {
		// ширина первого марша
		var firstMarsh = new THREE.Object3D();
		var firstMarshMeshes = treadsObj.treads.children.filter( function(o){return o.marshId == 1 && !o.isTurn});
		//Ширина марша
		if (firstMarshMeshes.length > 0) {
			for (var i = 0; i < firstMarshMeshes.length; i++) {
				firstMarsh.add(firstMarshMeshes[i].clone());
			}
			var firstMarshBox = new THREE.Box3().setFromObject(firstMarsh);

			var min = firstMarshBox.min.y <= firstMarshBox.max.y ? 'min' : 'max';
			var dimPar = {
				p1: {
					x: firstMarshBox[min].x,
					y: firstMarshBox[min].y,
					z: firstMarshBox.min.z - carcasDelta,
				},
				p2: {
					x: firstMarshBox[min].x,
					y: firstMarshBox[min].y,
					z: firstMarshBox.max.z + carcasDelta,
				},
				offset: offset,
				basePlane: 'yz',
				baseAxis: 'z',
				dimSide: 'спереди',
				alwaysOnTop: true,
			}
			//При виде сверху корректируем параметры
			if (viewType == 'top') {
				dimPar.p1.y = topHeight;
				dimPar.p2.y = topHeight;
				dimPar.dimSide = 'спереди';
				dimPar.basePlane = 'xz';
				dimPar.alwaysOnTop = false;
				dimPar.offset = -offset;
				if ((params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') && turnFactor == -1) {
					dimPar.mirror = true;
				}
			}
			var dim = drawDimension3D_2(dimPar).mesh;
			mesh.add(dim);
		}
	}

	// размеры прямой лестницы
	if (params.stairModel == 'Прямая') {
		if (!additionalParams.hideTreadDimensions) {
			//Размер ступени 1 марша
			var treadDimensions = setTreadsDimensions(treadsObj, 1, viewType);
			mesh.add(treadDimensions);
		}

		//Размер марша
		if (viewType == 'side' || viewType == 'top') {
			var firstMarsh = new THREE.Object3D();
				for (var i = 0; i < treadsObj.treads.children.length; i++) {
				firstMarsh.add(treadsObj.treads.children[i].clone());
			}
			var boxMarsh = new THREE.Box3().setFromObject(firstMarsh);

			var dimPar = {
				p1: {
					x: boxMarsh.min.x - carcasOffset,
					y: boxMarsh.min.y,
					z: boxMarsh.min.z,
				},
				p2: {
					x: boxMarsh.max.x + offsetEnd,
					y: boxMarsh.max.y,
					z: boxMarsh.max.z,
				},
				offset: offset,
				basePlane: 'xy',
				baseAxis: 'x',
				dimSide: 'спереди',
				alwaysOnTop: true,
			}
			//При виде сверху корректируем параметры
			if (viewType == 'top') {
				dimPar.p1.y = topHeight;
				dimPar.p2.y = topHeight;
				dimPar.dimSide = 'спереди';
				dimPar.alwaysOnTop = false;
				dimPar.basePlane = 'xz';
			}
			var dim = drawDimension3D_2(dimPar).mesh;
			firstMarshSize = parseInt(dimPar.text);
			// $('#dim_3D .botMarshSize').text(dimPar.text);
			mesh.add(dim);

			// Габарит
			if (viewType !== 'top') {
				var gabarit = $('.gabarit_g').html() * 1.0;
				if (gabarit < (params.staircaseHeight - params.floorThickness)){
					var floorDist = params.staircaseHeight - gabarit - params.floorThickness;

					var p1 = {
						x:boxMarsh.max.x,
						y:0,
						z:boxMarsh.max.z
					};

					p1 = newPoint_xy(p1, -params.floorHoleLength, floorDist);
					var p2 = newPoint_xy(p1, 0, gabarit);
					var dimPar = {
						p1: p1,
						p2: p2,
						offset: 25,
						basePlane: 'xy',
						baseAxis: 'y',
						dimSide: 'спереди',
					}
					if (turnFactor == -1) {
						dimPar.mirror = true;
					}
					console.log(dimPar);

					var dim = drawDimension3D_2(dimPar).mesh;
					mesh.add(dim);
				}
			}
		}
	}

	// размеры не прямой лестницы
	if (params.stairModel && params.stairModel !== 'Прямая') {
		if (!additionalParams.hideTreadDimensions) {
			//Размер ступени 1 марша
			var treadDimensions = setTreadsDimensions(treadsObj, 1, viewType);
			mesh.add(treadDimensions);
		}

		// Высота первого поворота
		if (viewType == 'front' || viewType == 'side') {
			var firstMarsh = new THREE.Object3D();
			var firstMarshMeshes = treadsObj.treads.children.filter( function(o) {return (o.marshId == 1 || (params.stairModel == "П-образная с площадкой" && o.marshId == 2))});
			if (firstMarshMeshes.length > 0) {
				for (var i = 0; i < firstMarshMeshes.length; i++) {
					firstMarsh.add(firstMarshMeshes[i].clone());
				}
				var firstMarshBox = new THREE.Box3().setFromObject(firstMarsh);

				var bot = 'min'
				var top = 'max'
				var dimPar = {
					p1: {
						x: firstMarshBox.max.x,
						y: firstMarshBox.min.y - getMarshParams(1).h + params.treadThickness,
						z: firstMarshBox.max.z,
					},
					p2: {
						x: firstMarshBox.max.x,
						y: firstMarshBox.max.y,
						z: firstMarshBox.max.z,
					},
					offset: offset,
					basePlane: 'xy',
					baseAxis: 'y',
					dimSide: 'сзади',
					alwaysOnTop: true,
				}

				if (viewType == 'front') {
					dimPar.basePlane = 'yz';
					if (turnFactor == 1) {
						dimPar.dimSide = 'спереди';
					}
					if(turnFactor == -1){
						dimPar.mirror = true;
						if (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом') {
							dimPar.dimSide = 'спереди';
						}
					}
				}else{
					if (turnFactor == 1) {
						dimPar.mirror = true;
					}
					if (turnFactor == -1) {
						dimPar.dimSide = 'спереди';
						dimPar.mirror = true;
					}
				}

				if (params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') {
					if (viewType == 'side') {
						dimPar.mirror = true;
						dimPar.dimSide = 'сзади';
					}else{

						dimPar.dimSide = 'спереди';
					}
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				$('#dim_3D .botMarshSize').text(dimPar.text);
				mesh.add(dim);

				//Габарит
				{
					var gabarit = $('.gabarit_g').html() * 1.0;
					if (gabarit < (params.staircaseHeight - params.floorThickness)){
						var floorDist = params.staircaseHeight - gabarit - params.floorThickness;
						var viewPlane = 'xy';
						var viewBaseAxis = 'y';
						var viewDimSide = 'сзади';

						if(viewType == 'side'){
							var p1 = {
								x:firstMarshBox.max.x,
								y:0,
								z:firstMarshBox.max.z
							};

							var sizeDist = params.floorHoleWidth;
							if (params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') {
								sizeDist = params.floorHoleLength;
							}
							p1 = newPoint_xy(p1, -sizeDist, floorDist);
							var p2 = newPoint_xy(p1, 0, gabarit);
						}else{
							var p1 = {
								x:firstMarshBox.max.x,
								y:0,
								z:firstMarshBox.min.z
							};

							p1 = newPoint_xy(p1, -params.floorHoleWidth, floorDist);
							var p2 = newPoint_xy(p1, 0, gabarit);
							if(turnFactor == -1) p1.z = p2.z = params.M / 2;
							viewPlane = 'yz';
							viewDimSide = 'спереди';
						}

						var dimPar = {
							p1: p1,
							p2: p2,
							offset: 25,
							basePlane: viewPlane,
							baseAxis: viewBaseAxis,
							dimSide: viewDimSide,
						}
						if (turnFactor == -1) {
							// dimPar.dimSide = dimPar.dimSide == 'спереди' ? 'сзади' : 'спереди';
							dimPar.mirror = true;
						}

						var dim = drawDimension3D_2(dimPar).mesh;
						mesh.add(dim);
					}
				}
			}
		}
		// Длинна первого марша
		if (viewType == 'side' || viewType == 'top') {
			var firstMarsh = new THREE.Object3D();
			var firstMarshMeshes = treadsObj.treads.children.filter( function(o) {return (o.marshId == 1 || (params.stairModel == "П-образная с площадкой" && o.marshId == 2))});
			if (firstMarshMeshes.length > 0) {
				for (var i = 0; i < firstMarshMeshes.length; i++) {
					firstMarsh.add(firstMarshMeshes[i].clone());
				}
				var firstMarshBox = new THREE.Box3().setFromObject(firstMarsh);

				var bot = 'min'
				var top = 'max'
				var dimPar = {
					p1: {
						x: firstMarshBox.min.x - carcasOffset,
						y: firstMarshBox[bot].y,
						z: firstMarshBox.min.z + params.M / 2 * (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && turnFactor == -1 ? -1 : 1,
					},
					p2: {
						x: firstMarshBox.max.x + carcasDelta,
						y: firstMarshBox[top].y,
						z: firstMarshBox.min.z + params.M / 2 * (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && turnFactor == -1 ? -1 : 1,
					},
					offset: offset,
					basePlane: 'xy',
					baseAxis: 'x',
					dimSide: 'сзади',
					alwaysOnTop: true,
				}
				if ((params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') && turnFactor == -1) dimPar.dimSide = 'спереди';
				//При виде сверху корректируем параметры
				if (viewType == 'top') {
					dimPar.p1.y = topHeight;
					dimPar.p2.y = topHeight;
					dimPar.dimSide = 'спереди';
					dimPar.alwaysOnTop = false;
					dimPar.basePlane = 'xz';
					dimPar.mirror = true;
					dimPar.offset = (-params.M / 2 - offset) * turnFactor;
				}
				//учитываем что площадка из рифленки имеет зазор 5мм от тетивы
				if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
					if(params.stairModel == 'Г-образная с площадкой' || (params.stairModel == 'П-образная трехмаршевая' && turnType_1 == "площадка")) {
						dimPar.p2.x += 5;
					}
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				firstMarshSize = parseInt(dimPar.text);
				mesh.add(dim);
			}
		}

		//Размеры второго марша
		if (params.stairModel == 'П-образная трехмаршевая' && (viewType == 'front' || viewType == 'top')) {
			if (!additionalParams.hideTreadDimensions) {
				//Размер ступени 2 марша
				var treadDimensions = setTreadsDimensions(treadsObj, 2, viewType);
				mesh.add(treadDimensions);
			}
			// Длинна второго марша
			var secondMarsh = new THREE.Object3D();
			var secondMarshMeshes = treadsObj.treads.children.filter( function(o){return o.marshId == 2 || o.marshId == 1});
			if (secondMarshMeshes.length > 0) {
				for (var i = 0; i < secondMarshMeshes.length; i++) {
					secondMarsh.add(secondMarshMeshes[i].clone());
				}
				var secondMarshBox = new THREE.Box3().setFromObject(secondMarsh);
				secondMarshBox.min.y += getMarshParams(1).height;// + getMarshParams(2).height + getMarshParams(2).h;

				var min = 'min';
				var max = 'max';
				if (turnFactor == -1) {
					var min = 'max';
					var max = 'min';
				}

				var dimPar = {
					p1: {
						x: secondMarshBox.max.x - params.M / 2,
						y: secondMarshBox[min].y,
						z: secondMarshBox.min.z - carcasDelta,
					},
					p2: {
						x: secondMarshBox.max.x - params.M / 2,
						y: secondMarshBox[max].y,
						z: secondMarshBox.max.z + carcasDelta,
					},
					offset: offset,
					basePlane: 'yz',
					baseAxis: 'z',
					dimSide: 'спереди',
					alwaysOnTop: true,
				}
				//При виде сверху корректируем параметры
				if (viewType == 'top') {
					dimPar.p1.y = topHeight;
					dimPar.p2.y = topHeight;
					dimPar.dimSide = 'спереди';
					dimPar.alwaysOnTop = false;
					dimPar.basePlane = 'xz';
					// dimPar.mirror = true;
					dimPar.offset = params.M / 2 + offset;
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				secondMarshSize = parseInt(dimPar.text);
				mesh.add(dim);
			}
		}

		if (!additionalParams.hideTreadDimensions) {
			//Размер ступени 3 марша
			var treadDimensions = setTreadsDimensions(treadsObj, 3, viewType);
			mesh.add(treadDimensions);
		}
		// Длинна третьего марша
		var thirdMarsh = new THREE.Object3D();
		var botMarshId = getMarshParams(3).prevMarshId;
		//Для г-образной и п-образной положения и оси размера отличаются
		if ((params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') && (viewType == 'front' || viewType == 'top')) {
			var thirdMarshMeshes = treadsObj.treads.children.filter( function(o) {return o.marshId == 3 || o.marshId == botMarshId});
			if (thirdMarshMeshes.length > 0) {
				for (var i = 0; i < thirdMarshMeshes.length; i++) {
					thirdMarsh.add(thirdMarshMeshes[i].clone());
				}
				var thirdMarshBox = new THREE.Box3().setFromObject(thirdMarsh);
				var bot = 'min'
				var top = 'max'
				if (turnFactor == -1) {
					bot = 'max';
					top = 'min';
				}
				thirdMarshBox.min.y += getMarshParams(1).height;
				var dimPar = {
					p1: {
						x: thirdMarshBox.max.x - params.M / 2,
						y: thirdMarshBox[bot].y,
						z: thirdMarshBox.min.z - carcasDelta,
					},
					p2: {
						x: thirdMarshBox.max.x - params.M / 2,
						y: thirdMarshBox[top].y,
						z: thirdMarshBox.max.z + offsetEnd,
					},
					offset: offset,
					basePlane: 'yz',
					baseAxis: 'z',
					dimSide: 'спереди',
					alwaysOnTop: true,
				}
				//При виде сверху корректируем параметры
				if (viewType == 'top') {
					dimPar.p1.y = topHeight;
					dimPar.p2.y = topHeight;
					dimPar.dimSide = 'спереди';
					dimPar.alwaysOnTop = false;
					dimPar.basePlane = 'xz';
					if ((params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') && turnFactor == -1) {
						dimPar.mirror = true;
					}
					dimPar.offset = params.M / 2 + offset;
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				thirdMarshSize = parseInt(dimPar.text);
				mesh.add(dim);
			}
		}
		if ((params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой') && (viewType == 'side' || viewType == 'top')) {
			var thirdMarshMeshes = treadsObj.treads.children.filter( function(o) {return (o.marshId == 3 || (o.marshId == 2 && o.isTurn))});
			if (params.stairModel == 'П-образная трехмаршевая') {
				thirdMarshMeshes = treadsObj.treads.children.filter( function(o){ return (o.marshId == 3 || o.marshId == botMarshId)});
			}
			if (thirdMarshMeshes.length > 0) {
				for (var i = 0; i < thirdMarshMeshes.length; i++) {
					thirdMarsh.add(thirdMarshMeshes[i].clone());
				}

				var thirdMarshBox = new THREE.Box3().setFromObject(thirdMarsh);

				var bot = 'min'
				var top = 'max'
				if (params.stairModel == 'П-образная трехмаршевая') {
					thirdMarshBox[bot].y += getMarshParams(2).height;
				}
				//Учитываем минимум и максимум в зависимости от поворота лестницы
				var turnFactorFix = 'max';
				if (turnFactor == -1) turnFactorFix = 'min';
				var dimPar = {
					p1: {
						x: thirdMarshBox.max.x + carcasDelta,
						y: thirdMarshBox[bot].y,
						z: thirdMarshBox[turnFactorFix].z - params.M / 2 * turnFactor,
					},
					p2: {
						x: thirdMarshBox.min.x - offsetEnd,
						y: thirdMarshBox[top].y,
						z: thirdMarshBox[turnFactorFix].z - params.M / 2 * turnFactor,
					},
					offset: offset,
					basePlane: 'xy',
					baseAxis: 'x',
					dimSide: 'сзади',
					alwaysOnTop: true,
				}
				//При виде сверху корректируем параметры
				if (viewType == 'top') {
					dimPar.p1.y = topHeight;
					dimPar.p2.y = topHeight;
					dimPar.dimSide = 'спереди';
					dimPar.alwaysOnTop = false;
					dimPar.basePlane = 'xz';
					dimPar.mirror = true;
					dimPar.offset = (params.M / 2 + offset) * turnFactor;
				}

				var dim = drawDimension3D_2(dimPar).mesh;
				thirdMarshSize = parseInt(dimPar.text);
				mesh.add(dim);
			}
		}
	}

	if (params.calcType == 'vint' && window.vintStaircaseMoove) {
		var dimPar = {
			p1: {
				x: window.vintStaircaseMoove.x,
				y: params.staircaseHeight,
				z: window.vintStaircaseMoove.z,
			},
			p2: {
				x: window.vintStaircaseMoove.x,
				y: params.staircaseHeight,
				z: 0,
			},
			offset: 100,
			basePlane: 'yz',
			baseAxis: 'z',
			dimSide: 'спереди'
		}

		if (viewType == 'top') dimPar.basePlane = 'xz';

		var dim = drawDimension3D_2(dimPar).mesh;
		mesh.add(dim);

		var dimPar = {
			p1: {
				x: 0,
				y: params.staircaseHeight,
				z: window.vintStaircaseMoove.z,
			},
			p2: {
				x: window.vintStaircaseMoove.x,
				y: params.staircaseHeight,
				z: window.vintStaircaseMoove.z,
			},
			offset: 100,
			basePlane: 'xy',
			baseAxis: 'x',
			dimSide: 'спереди'
		}

		if (viewType == 'top') dimPar.basePlane = 'xz';

		var dim = drawDimension3D_2(dimPar).mesh;
		mesh.add(dim);
	}

	//Размеры для 3д
	if (viewType == '3d') {
		if (params.stairModel == 'Прямая') {
			if (!additionalParams.hideTreadDimensions) {
				//Размеры ступени
				var treadDimensions = setTreadsDimensions(treadsObj, 1, "3d");
				mesh.add(treadDimensions);
			}

			var firstMarsh = new THREE.Object3D();
				for (var i = 0; i < treadsObj.treads.children.length; i++) {
				firstMarsh.add(treadsObj.treads.children[i].clone());
			}
			var boxMarsh = new THREE.Box3().setFromObject(firstMarsh);

			var dimPar = {
				p1: {
					x: boxMarsh.min.x - carcasOffset,
					y: boxMarsh.min.y,
					z: boxMarsh.min.z + params.M / 2,
				},
				p2: {
					x: boxMarsh.max.x + offsetEnd,
					y: boxMarsh.max.y,
					z: boxMarsh.min.z + params.M / 2,
				},
				offset: offset,
				basePlane: 'xy',
				baseAxis: 'x',
				dimSide: 'спереди',
				alwaysOnTop: true,
			}
			var dim = drawDimension3D_2(dimPar).mesh;
			firstMarshSize = parseInt(dimPar.text);
			// $('#dim_3D .botMarshSize').text(dimPar.text);
			mesh.add(dim);

			//Габарит
			{
				var gabarit = $('.gabarit_g').html() * 1.0;
				if (gabarit < (params.staircaseHeight - params.floorThickness)){
					var floorDist = params.staircaseHeight - gabarit - params.floorThickness;
					var stairAngle = Math.atan(params.h1 / params.b1);
					var p1 = {
						x:dimPar.p2.x,
						y:0,
						z:dimPar.p2.z
					};
					p1 = newPoint_xy(p1, -params.floorHoleLength, floorDist);
					var p2 = newPoint_xy(p1, 0, gabarit);

					var dimPar = {
						p1: p1,
						p2: p2,
						offset: 5,
						basePlane: 'xy',
						baseAxis: 'y',
						dimSide: 'спереди',
					}

					var dim = drawDimension3D_2(dimPar).mesh;
					mesh.add(dim);
				}
			}
		}

		if (params.stairModel && params.stairModel !== 'Прямая') {
			if (!additionalParams.hideTreadDimensions) {
				//Размеры ступени
				var treadDimensions = setTreadsDimensions(treadsObj, 1, "3d");
				mesh.add(treadDimensions);
			}

			// Длинна первого марша
			var firstMarsh = new THREE.Object3D();
			var firstMarshMeshes = treadsObj.treads.children.filter( function(o) {return (o.marshId == 1 || (params.stairModel == "П-образная с площадкой" && o.marshId == 2))});
			if (firstMarshMeshes.length > 0) {
				for (var i = 0; i < firstMarshMeshes.length; i++) {
					firstMarsh.add(firstMarshMeshes[i].clone());
				}
				var firstMarshBox = new THREE.Box3().setFromObject(firstMarsh);

				var bot = 'min'
				var top = 'max'
				var dimPar = {
					p1: {
						x: firstMarshBox.min.x - carcasOffset,
						y: firstMarshBox[bot].y,
						z: firstMarshBox.min.z + params.M / 2 * (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && turnFactor == -1 ? -1 : 1,
					},
					p2: {
						x: firstMarshBox.max.x + carcasDelta,
						y: firstMarshBox[top].y,
						z: firstMarshBox.min.z + params.M / 2 * (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && turnFactor == -1 ? -1 : 1,
					},
					offset: offset,
					basePlane: 'xy',
					baseAxis: 'x',
					dimSide: 'спереди',
				}
				//учитываем что площадка из рифленки имеет зазор 5мм от тетивы
				if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
					if(params.stairModel == 'Г-образная с площадкой' || (params.stairModel == 'П-образная трехмаршевая' && turnType_1 == "площадка")) {
						dimPar.p2.x += 5;
					}
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				firstMarshSize = parseInt(dimPar.text);
				mesh.add(dim);

				//Габарит
				{
					var gabarit = $('.gabarit_g').html() * 1.0;
					if (gabarit < (params.staircaseHeight - params.floorThickness)){
						var floorDist = params.staircaseHeight - gabarit - params.floorThickness;
						var stairAngle = Math.atan(params.h1 / params.b1);
						var p1 = {
							x:dimPar.p2.x,
							y:0,
							z:dimPar.p2.z
						};
						p1 = newPoint_xy(p1, -params.floorHoleWidth, floorDist);
						var p2 = newPoint_xy(p1, 0, gabarit);

						var dimPar = {
							p1: p1,
							p2: p2,
							offset: 5,
							basePlane: 'xy',
							baseAxis: 'y',
							dimSide: 'спереди',
						}

						var dim = drawDimension3D_2(dimPar).mesh;
						mesh.add(dim);
					}
				}
			}

			//Размеры второго марша
			if (params.stairModel == 'П-образная трехмаршевая') {
				if (!additionalParams.hideTreadDimensions) {
					//Размеры ступени 2 марша
					var treadDimensions = setTreadsDimensions(treadsObj, 2, "3d");
					mesh.add(treadDimensions);
				}

				// Длинна второго марша
				var secondMarsh = new THREE.Object3D();
				var secondMarshMeshes = treadsObj.treads.children.filter( function(o){return o.marshId == 2 || o.marshId == 1});
				if (secondMarshMeshes.length > 0) {
					for (var i = 0; i < secondMarshMeshes.length; i++) {
						secondMarsh.add(secondMarshMeshes[i].clone());
					}
					var secondMarshBox = new THREE.Box3().setFromObject(secondMarsh);

					var dimPar = {
						p1: {
							x: secondMarshBox.max.x - params.M / 2,
							y: secondMarshBox.min.y,
							z: secondMarshBox.min.z - carcasDelta,
						},
						p2: {
							x: secondMarshBox.max.x - params.M / 2,
							y: secondMarshBox.max.y,
							z: secondMarshBox.max.z + carcasDelta,
						},
						offset: offset,
						basePlane: 'yz',
						baseAxis: 'z',
						dimSide: 'спереди',
					}

					var dim = drawDimension3D_2(dimPar).mesh;
					secondMarshSize = parseInt(dimPar.text);
					mesh.add(dim);
				}
			}

			if (!additionalParams.hideTreadDimensions) {
				//Размеры ступени 3 марша
				var treadDimensions = setTreadsDimensions(treadsObj, 3, "3d");
				mesh.add(treadDimensions);
			}

			// Длинна третьего марша
			var thirdMarsh = new THREE.Object3D();
			var botMarshId = getMarshParams(3).prevMarshId;
			if (params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') {
				var thirdMarshMeshes = treadsObj.treads.children.filter( function(o){return o.marshId == 3 || o.marshId == botMarshId});
				if (thirdMarshMeshes.length > 0) {
					for (var i = 0; i < thirdMarshMeshes.length; i++) {
						thirdMarsh.add(thirdMarshMeshes[i].clone());
					}
					var thirdMarshBox = new THREE.Box3().setFromObject(thirdMarsh);
					var bot = 'min'
					var top = 'max'
					if (turnFactor == -1) {
						bot = 'max';
						top = 'min';
					}
					var dimPar = {
						p1: {
							x: thirdMarshBox.max.x - params.M / 2,
							y: thirdMarshBox[bot].y,
							z: thirdMarshBox.min.z - carcasDelta,
						},
						p2: {
							x: thirdMarshBox.max.x - params.M / 2,
							y: thirdMarshBox[top].y,
							z: thirdMarshBox.max.z + offsetEnd,
						},
						offset: offset,
						basePlane: 'yz',
						baseAxis: 'z',
						dimSide: 'спереди',
					}
					var dim = drawDimension3D_2(dimPar).mesh;
					thirdMarshSize = parseInt(dimPar.text);
					mesh.add(dim);
				}
			}
			if (params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой') {
				var thirdMarshMeshes = treadsObj.treads.children.filter( function(o){return (o.marshId == 3 || (o.marshId == 2 && o.isTurn))});
				if (params.stairModel == 'П-образная трехмаршевая') {
					thirdMarshMeshes = treadsObj.treads.children.filter( function(o){return (o.marshId == 3 || o.marshId == botMarshId)});
				}
				if (thirdMarshMeshes.length > 0) {
					for (var i = 0; i < thirdMarshMeshes.length; i++) {
						thirdMarsh.add(thirdMarshMeshes[i].clone());
					}

					var thirdMarshBox = new THREE.Box3().setFromObject(thirdMarsh);
					var bot = 'min';
					var top = 'max';

					//Учитываем минимум и максимум в зависимости от поворота лестницы
					var turnFactorFix = 'max';
					if (turnFactor == -1) turnFactorFix = 'min';
					var dimPar = {
						p1: {
							x: thirdMarshBox.max.x + carcasDelta,
							y: thirdMarshBox[bot].y,
							z: thirdMarshBox[turnFactorFix].z - params.M / 2 * turnFactor,
						},
						p2: {
							x: thirdMarshBox.min.x - offsetEnd,
							y: thirdMarshBox[top].y,
							z: thirdMarshBox[turnFactorFix].z - params.M / 2 * turnFactor,
						},
						offset: offset,
						basePlane: 'xy',
						baseAxis: 'x',
						dimSide: 'спереди',
					}

					var dim = drawDimension3D_2(dimPar).mesh;
					thirdMarshSize = parseInt(dimPar.text);
					mesh.add(dim);
				}
			}
		}

		// window.firstMarshSize = firstMarshSize;
		if (params.stairModel && params.stairModel != 'Прямая') {
			if(typeof secondMarshSize != 'undefined') window.secondMarshSize = secondMarshSize;
			if(typeof thirdMarshSize != 'undefined') window.thirdMarshSize = thirdMarshSize;
		}

		window.ladderLoaded = true;
		if (typeof compareDimensions !== 'undefined') compareDimensions();
		if (window.testingCallback) window.testingCallback();
	}

	par.mesh = mesh;
	return par;
}

/**
	Отрисовывает размеры Навеса

	@param {object} treadsObj - объект ступеней, нужен чтобы снять точки для рассчета размеров

	@return {mesh} mesh
*/

function draw3DDimensionsCarport(par){
	par.mesh = new THREE.Object3D();
	var offset = 100;// отступ от объекта
	var viewType = par.view;
	if (par.view == '3d') viewType = '3d';
	if (!window.carportColumns || !window.carportRoof)  return par;
	
	// размеры по колоннам
	var columnsObj = carportColumns.clone();
	var columnsBox = new THREE.Box3().setFromObject(columnsObj);

	if (viewType == 'left' || viewType == '3d') {
		// Ширина
		var dimPar = {
			p1: {
				x: columnsBox.min.x,
				y: columnsBox.min.y,
				z: columnsBox.max.z,
			},
			p2: {
				x: columnsBox.max.x,
				y: columnsBox.min.y,
				z: columnsBox.max.z,
			},
			offset: offset,
			basePlane: 'xy',
			baseAxis: 'x',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	if (viewType == 'front' || viewType == '3d') {
		// Длина
		var dimPar = {
			p1: {
				x: columnsBox.max.x,
				y: columnsBox.min.y,
				z: columnsBox.max.z,
			},
			p2: {
				x: columnsBox.max.x,
				y: columnsBox.min.y,
				z: columnsBox.min.z,
			},
			offset: offset,
			basePlane: 'yz',
			baseAxis: 'z',
			dimSide: 'сзади',
			alwaysOnTop: true,
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	if (viewType == 'left' || viewType == '3d') {
		// Высота
		var dimPar = {
			p1: {
				x: columnsBox.max.x,
				y: columnsBox.min.y,
				z: columnsBox.max.z,
			},
			p2: {
				x: columnsBox.max.x,
				y: columnsBox.max.y,
				z: columnsBox.max.z,
			},
			offset: -300,
			basePlane: 'xy',
			baseAxis: 'y',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	// Размеры крыши
	
	if(typeof roofObj == 'undefined') return par;
		
	var roofObj = carportRoof.clone();
	var roofBox = new THREE.Box3().setFromObject(roofObj);
	
	if (viewType == 'left' || viewType == '3d') {
		// Ширина
		var dimPar = {
			p1: {
				x: roofBox.min.x,
				y: roofBox.min.y,
				z: roofBox.max.z,
			},
			p2: {
				x: roofBox.max.x,
				y: roofBox.min.y,
				z: roofBox.max.z,
			},
			offset: roofBox.max.y - roofBox.min.y + 300,
			basePlane: 'xy',
			baseAxis: 'x',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	if (viewType == 'front' || viewType == '3d') {
		// Длина
		var dimPar = {
			p1: {
				x: roofBox.max.x,
				y: roofBox.min.y,
				z: roofBox.max.z,
			},
			p2: {
				x: roofBox.max.x,
				y: roofBox.min.y,
				z: roofBox.min.z,
			},
			offset: -600,
			basePlane: 'yz',
			baseAxis: 'z',
			dimSide: 'сзади',
			alwaysOnTop: true,
		}
		if (params.carportType == 'односкатный' || params.carportType == 'консольный') {
			dimPar.p1.x = roofBox.min.x;
			dimPar.p2.x = roofBox.min.x;
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	if (viewType == 'left' || viewType == '3d') {
		var carportFullObj = new THREE.Object3D();
		carportFullObj.add(carportRoof.clone());
		carportFullObj.add(carportColumns.clone());
		var carportFullBox = new THREE.Box3().setFromObject(carportFullObj);
		// Общая высота вместе с кровлей
		var dimPar = {
			p1: {
				x: carportFullBox.min.x + (carportFullBox.max.x - carportFullBox.min.x) / 2,
				y: carportFullBox.min.y,
				z: carportFullBox.max.z,
			},
			p2: {
				x: carportFullBox.min.x + (carportFullBox.max.x - carportFullBox.min.x) / 2,
				y: carportFullBox.max.y,
				z: carportFullBox.max.z,
			},
			offset: offset,
			basePlane: 'xy',
			baseAxis: 'y',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		if (params.carportType == 'односкатный' || params.carportType == 'консольный') {
			dimPar.p1.x = carportFullBox.max.x;
			dimPar.p2.x = carportFullBox.max.x;
		}
		
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
		// Высота нижней части кровли
		var dimPar = {
			p1: {
				x: roofBox.min.x,
				y: roofBox.min.y,
				z: roofBox.max.z,
			},
			p2: {
				x: roofBox.min.x,
				y: 0,
				z: roofBox.max.z,
			},
			offset: offset,
			basePlane: 'xy',
			baseAxis: 'y',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		if (params.carportType == 'односкатный' || params.carportType == 'консольный') dimPar.offset = -400
		var dim = drawDimension3D_2(dimPar).mesh;
		par.mesh.add(dim);
	}

	return par;
}


function setTreadsDimensions(treadsObj, marshId, viewType){
	if(!marshId) return;
	var dimensions = new THREE.Object3D();

	var marshParams = getMarshParams(marshId);

	var marshObject = treadsObj.treads.children.find(function(o) {return o.marshId == marshId})
	if (marshObject) {
		marshObject = marshObject.clone();
		var marshFirstTread = marshObject.children.find(function(node){return node.userData.treadIndex == 0});
		if (!marshFirstTread) return dimensions;

		marshObject.getWorldPosition(new THREE.Vector3());

		var treadBox = new THREE.Box3().setFromObject(marshFirstTread);

		var has_a_dim = true;
		if ((params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')) {
			if(viewType == 'side' && marshId == 3) has_a_dim = false;
		}

		var has_h_dim = true;
		if(viewType == 'top') has_h_dim = false;

		if(has_a_dim) {
			var dimPar = {
				p1: {
					x: treadBox.min.x,
					y: treadBox.max.y,
					z: treadBox.min.z
				},
				p2: {
					x: treadBox.max.x,
					y: treadBox.max.y,
					z: treadBox.max.z
				},
				offset: 5,
				basePlane: 'xz',
				baseAxis: 'x',
				dimSide: 'спереди',
			}
			if (window.location.href.includes('/geometry/')) {
				dimPar.alwaysOnTop = true;
			}
			if (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом') {
				if (turnFactor == -1 && marshId == 3 && viewType == 'top') {
					dimPar.mirror = true;
				}

				if(marshId == 3) dimPar.baseAxis = 'z';
			}
			if (viewType == 'side') {
				dimPar.basePlane = 'xy';
				dimPar.dimSide = 'сзади';
				dimPar.offset = 140;
				if ((params.dimScale * 1.0) > 1) {
					dimPar.offset *= (params.dimScale / 3);
				}
				if (turnFactor == -1) {
					dimPar.dimSide = 'спереди';
				}
			}

			if ((params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой')) {
				if (marshId == 1) {
					dimPar.mirrorSide = true;
					if (turnFactor == -1 && viewType == 'side') {
						dimPar.dimSide = 'сзади';
					}
				}
				if (marshId == 2) {
					dimPar.baseAxis = 'z';
					dimPar.basePlane = 'yz';
				}
				if (marshId == 3) {
					dimPar.mirrorSide = true;
					if (turnFactor == -1 && viewType == 'side') {
						dimPar.dimSide = 'сзади';
					}
				}
			}


			if(viewType == 'top') {
				dimPar.p2.y += 5000;
				dimPar.offset = 200;
				if ((params.dimScale * 1.0) > 1) {
					dimPar.offset *= (params.dimScale / 3);
				}
			}
			if (params.stairModel == 'Прямая') {
				dimPar.dimSide = 'спереди';
			}

			// if (viewType == 'front' && marshId == 3 && (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')) {
				// 	dimPar.basePlane = 'yz';
				// 	dimPar.baseAxis = 'x';
				// }

				var dim = drawDimension3D_2(dimPar).mesh;
				dimensions.add(dim);
			}

			if (has_h_dim) {
				var dimPar = {
					p1: {
						x: treadBox.max.x,
						y: treadBox.max.y,
						z: treadBox.max.z
					},
					p2: {
						x: treadBox.max.x,
						y: treadBox.max.y + marshParams.h,
						z: treadBox.max.z
					},
					offset: 25,
					basePlane: 'xy',
					baseAxis: 'y',
					dimSide: 'спереди',
				}
				if (window.location.href.includes('/geometry/')) {
					dimPar.alwaysOnTop = true;
				}

				if (viewType == 'side') {
					dimPar.dimSide = 'сзади';
					dimPar.offset = marshParams.a + 50;
					dimPar.mirrorSide = true;
					if (turnFactor == -1) {
						dimPar.dimSide = 'спереди';
					}
				}
				if(params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная трехмаршевая'){
					if (marshId == 3) {
						dimPar.p1.x = treadBox.min.x;
						dimPar.p2.x = treadBox.min.x;
						if (viewType == 'side') {
							dimPar.offset = -marshParams.a - 50
							if (params.stairModel == 'П-образная с площадкой') {
								dimPar.offset -= 200;
							}
							dimPar.mirrorSide = false;
						}
					}
					if (marshId == 2){
						dimPar.basePlane = 'yz';
						if(viewType == 'front'){
							dimPar.offset = -marshParams.a - 50
						}
					}
					if (viewType == 'side' && turnFactor == -1) {
						dimPar.dimSide = 'сзади'
					}
				}
				if (params.stairModel == 'Прямая') {
					dimPar.dimSide = 'спереди';
				}

				// if (viewType == 'front' && marshId == 1) {
					// 	dimPar.basePlane = 'yz';
					// 	dimPar.baseAxis = 'y';
					// }

					var dim = drawDimension3D_2(dimPar).mesh;
					dimensions.add(dim);
				}
	}

	return dimensions;
}

/**
 * Размеры проема
 */
function drawFloorHoleDimensions(viewType){
	var mesh = new THREE.Object3D();

	//Ширина проема
	dimPar = {
		p1: {
			x: 0,
			y: params.staircaseHeight,
			z: 0,
		},
		p2: {
			x: 0,
			y: params.staircaseHeight + 5,
			z: params.floorHoleWidth * turnFactor,
		},
		offset: 50,
		basePlane: 'xz',
		baseAxis: 'z',
		dimSide: 'спереди',
		// alwaysOnTop: true,
	}

	//Г-образные вид слева, остальные спереди
	if (viewType == 'left' && (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')){
		dimPar.basePlane = 'yz';
	}
	if (viewType == 'front' && params.stairModel == 'Прямая' || params.calcType == 'vint') dimPar.basePlane = 'yz';
	if (viewType == 'front' && (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная трехмаршевая')) {
		dimPar.basePlane = 'yz';
		dimPar.dimSide = 'сзади';
	}

	var dim = drawDimension3D_2(dimPar).mesh;
	mesh.add(dim);

	//Длинна проема
	dimPar = {
		p1: {
			x: 0,
			y: params.staircaseHeight,
			z: 0,
		},
		p2: {
			x: -params.floorHoleLength,
			y: params.staircaseHeight + 5,
			z: 0,
		},
		offset: -50,
		basePlane: 'xz',
		baseAxis: 'x',
		dimSide: 'спереди',
		// alwaysOnTop: true,
	}

	//Г-образные вид спереди, остальные слева
	if (
		(viewType == 'front' && (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')) ||
		(viewType == 'left' && !(params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом'))
	){
		dimPar.basePlane = 'xy';
		dimPar.offset = 50;
		if (turnFactor == -1 && (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')) {
			dimPar.dimSide = 'сзади';
		}
	}

	if (viewType == 'top') dimPar.offset = -300 * turnFactor;

	if (params.dimScale * 1.0 > 1) {
		var koef = params.dimScale;
		if (viewType == 'top') {
			koef = params.dimScale / 3;
		}
		dimPar.offset *= koef;
	}

	var dim = drawDimension3D_2(dimPar).mesh;
	mesh.add(dim);

	//высота проема
	if (viewType !== 'top') {
		dimPar = {
			p1: {
				x: -params.floorHoleLength,
				y: 0,
				z: params.floorHoleWidth,
			},
			p2: {
				x: -params.floorHoleLength,
				y: params.staircaseHeight,
				z: params.floorHoleWidth,
			},
			offset: -300,
			basePlane: 'xy',
			baseAxis: 'y',
			dimSide: 'спереди',
			alwaysOnTop: true,
		}
		if (params.dimScale * 1.0 > 1) {
			dimPar.offset *= params.dimScale / 3;
		}
		if (turnFactor == -1 && viewType == 'front' && (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом')) {
			dimPar.dimSide = 'сзади';
		}

		var dim = drawDimension3D_2(dimPar).mesh;
		mesh.add(dim);
	}

	return mesh;
}

/**
	Функция устанавливает размеры для одного вида
*/
function setDimensions(viewportId, viewType, callback, dimensionParams){
	if(typeof treadsObj == 'undefined' && params.calcType !== 'vint' && params.calcType !== 'carport'){
		console.log("Невозможно построить размеры, treadsObj нужно сделать глобальным!");
		return;
	}

	if (typeof treadsObj == 'undefined') {
		var moove = {x:0,y:0,z:0, rot: 0};
	}else{
		var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);
	}
	var dimensionsPar = {
		treadsObj: window.treadsObj,
		view: viewType,
		additionalParams: dimensionParams
	};

	if (params.calcType == 'carport') {
		var dimMesh = draw3DDimensionsCarport(dimensionsPar).mesh;
		
	}else{
		var dimMesh = draw3DDimensions(dimensionsPar).mesh;
	}

	dimMesh.position.x += moove.x;
	dimMesh.position.y += moove.y;
	dimMesh.position.z += moove.z;
	dimMesh.rotation.y = moove.rot;

	addObjects(viewportId, dimMesh, 'dimensions');

	// Размеры проема
	if (params.calcType != 'carport') {
		var floorHoleDimensions = drawFloorHoleDimensions(viewType);
		addObjects(viewportId, floorHoleDimensions, 'dimensions');
	}
};

/**
	Функция отрисовывает все виды
*/
makeDrawings = function(callback, dimensionParams){
	if(!dimensionParams) dimensionParams = {};
	$('#geomDrawings').html(null);
	view.renderer.setClearColor(new THREE.Color(0xFFFFFF))
	// params.dimScale = "2.5";
	var viewportId = 'vl_1';
	makeDrawing(viewportId, "front", function(){
		makeDrawing(viewportId, "left", function(){
			if (params.calcType == 'carport') {
				var campos = [-5000, 3000, 5000];
	
				view.camera = new THREE.PerspectiveCamera(45, view.width / view.height,  100, 100000);
				view.camera.position.set(...campos);
				view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);

				if(callback) callback();
			}else{
				makeDrawing(viewportId, "top", function(){
					removeObjects(viewportId, 'dimensions');
					var campos = [-5000, 3000, 5000];
	
					view.camera = new THREE.PerspectiveCamera(45, view.width / view.height,  100, 100000);
					view.camera.position.set(...campos);
					view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
	
					if(callback) callback();
				},dimensionParams);
			}
		},dimensionParams);
	},dimensionParams);

};

/**
	Функция отрисовывает один вид
*/
makeDrawing = function(viewportId, viewType, callback, dimensionParams){
	removeObjects('vl_1', 'dimensions');
	view.camera = new THREE.OrthographicCamera( view.width / - 0.25, view.width / 0.25, view.height / 0.25, view.height / - 0.25, -20000, 50000);
	if (typeof treadsObj == 'undefined') {
		if (params.calcType == 'vint') {
			var mainObj = window.vintTreads;
		}else if(params.calcType == 'carport' && window.carportColumns){
			var mainObj = window.carportColumns;
		}else{
			var mainObj = new THREE.Object3D();
		}
	}else{
		var mainObj = treadsObj.treads;
	}

	fitCameraToObject(mainObj, viewType);
	setDimensions(viewportId, viewType, callback, dimensionParams);
	var floorView = viewType;
	if (floorView == 'left' || floorView == 'right') floorView = 'side';
	if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная трехмаршевая') {
		if (floorView == 'front'){
			 floorView = 'side';
		}else if (floorView == 'side') {
			floorView = 'front';
		}
	};
	if (params.stairModel == 'Прямая' || params.calcType == 'vint') {
		if (viewType == 'front'){
				floorView = 'side';
		}else if ((viewType == 'left' || viewType == 'right')) {
			floorView = 'front';
		}
	}
	if(!params.calcType == 'carport') addTopFloorGeom(floorView)
	setTimeout(function () {
		addDrawingsImage(dimensionParams);
		if (callback) callback();
	}, 0);
};

/**
	Функция копирует канвас в изображение
*/
addDrawingsImage = function(dimensionParams){
	var imgData = view.renderer.context.canvas.toDataURL();
	var width = "100%";
	var height = "100%";
	if (dimensionParams.imageWidth) width = dimensionParams.imageWidth;
	if (dimensionParams.imaegHeight) height = dimensionParams.imaegHeight;
	var elem = '<img ';
/*	
	//Ориентируемся на ширину
	if (dimensionParams.imageWidth) {
		elem += ` width='${width}' `;
	}
	
	if (!dimensionParams.imageWidth) {
		elem += ` height='${height}' `;
	}
*/	
	elem += `src="${imgData}" alt="">`;
	$('#geomDrawings').append(elem + "<br><br>");
}

addTopFloorGeom = function(view){
	var width = 1000;
	var length = 4000;
	var height = params.floorThickness;
	removeObjects('vl_1', 'topFloor');
	if (view == 'side') {
		var material = new THREE.MeshLambertMaterial({color: 0xBFBFBF});
		var geometry3 = new THREE.BoxGeometry( width, height, params.floorHoleLength );
		var cube3 = new THREE.Mesh( geometry3, material );
		cube3.position.x = params.staircasePosX - params.floorHoleLength / 2;
		cube3.position.z = params.staircasePosZ - width / 2 * turnFactor;
		cube3.position.y = params.staircaseHeight - height / 2;
		cube3.rotation.y = Math.PI / 2;

		var cube4 = cube3.clone();
		cube4.position.z += (params.floorHoleWidth + width) * turnFactor;
		addObjects('vl_1', cube3, 'topFloor');
		addObjects('vl_1', cube4, 'topFloor');
	}
	if (view == 'front') {
		var material = new THREE.MeshLambertMaterial({color: 0xBFBFBF});
		var geometry = new THREE.BoxGeometry( width, height, width + params.M );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = params.staircasePosX + width / 2;
		cube.position.z = params.staircasePosZ + ((width + params.M) / 2 - width) * turnFactor;
		cube.position.y = params.staircaseHeight - height / 2;
		addObjects('vl_1', cube, 'topFloor');

		var geometry2 = new THREE.BoxGeometry( width, height, length );
		var cube2 = new THREE.Mesh( geometry2, material );
		cube2.position.x = params.staircasePosX - width / 2 - params.floorHoleLength;
		cube2.position.z = params.staircasePosZ + (length / 2 - width) * turnFactor;
		cube2.position.y = params.staircaseHeight - height / 2;
		addObjects('vl_1', cube2, 'topFloor');
	}
	if (view == 'top') {
		addTopFloor('vl_1');
	}

	removeObjects('vl_1', 'beamTop');
}

/**
	Функция рассчитывает положения камеры для лестницы в зависимости от вида
*/
fitCameraToObject = function ( object, viewType ) {
	const boundingBox = new THREE.Box3();

	boundingBox.setFromObject( object );

	const center = boundingBox.getCenter();
	console.log(object, center)
	const size = boundingBox.getSize();
	//Получаем максимальный размер
	const maxDim = Math.max( size.x, size.y, size.z);


	//Масштаб изображения 1500 / maxDim примерно в притык
	var scale = 1000 / maxDim;
	if (params.calcType == 'timber_stock') scale = 800 / maxDim;
	if (params.calcType == 'vint') scale = 800 / maxDim;
	if (params.calcType == 'carport') scale = 700 / maxDim;
	view.camera = new THREE.OrthographicCamera( view.width / - scale, view.width / scale, view.height / scale, view.height / - scale, -20000, 50000);

	//Положения камер отличаются в зависимости от типа лестниц

	if (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом' || params.stairModel == 'П-образная трехмаршевая') {
		if (viewType == 'front') {
			view.camera.position.set(center.x, center.y, center.z + 5000 * turnFactor);
		}
		if (viewType == 'top') {
			view.camera.position.set(center.x, center.y + 3000, center.z);
		}
		if (viewType == 'left' || viewType == 'right') {
			var factor = 1;
			if (viewType == 'right') factor = -1;
			view.camera.position.set(-5000 * factor, center.y, center.z);
		}
	}

	if (params.calcType == 'vint' || params.stairModel == 'Прямая' || params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная трехмаршевая') {
		if (viewType == 'front') {
			view.camera.position.set(5000, center.y, center.z);
			if (params.stairModel == 'Прямая' || params.calcType == 'vint') {
				view.camera.position.set(-5000, center.y, center.z);
			}
		}
		if (viewType == 'top') {
			view.camera.position.set(center.x, center.y + 3000, center.z);
		}
		if (viewType == 'left' || viewType == 'right') {
			view.camera.position.set(center.x, center.y, center.z);
		}
	}

	if (params.calcType == 'carport') {
		if (viewType == 'top') {
			view.camera.position.set(center.x, center.y + 3000, center.z);
		}
		if (viewType == 'front') {
			view.camera.position.set(5000, center.y, center.z);
		}
		if (viewType == 'left' || viewType == 'right') {
			view.camera.position.set(center.x, center.y, center.z);
		}
	}
	view.camera.lookAt(center.x,center.y,center.z);
}

function compareDimensions(){
	var isTestOk = true;
	if (params.floorHoleLength < window.thirdMarshSize && params.stairModel != 'Прямая') {
		isTestOk = false;
		alertTrouble("Верхний марш длиннее проема", "forms");
	}
	if (params.floorHoleWidth < window.secondMarshSize && params.stairModel == 'П-образная трехмаршевая') {
		isTestOk = false;
		alertTrouble("Средний марш длиннее проема", "forms");
	}

	var result = "<span id='compareResult'><span class='green'>OK</span></span>";
	if(!isTestOk) result = "<span id='compareResult'><span class='red'>НЕ ПРОЙДЕН</span></span>";
	var resultText = "<b>Результаты проверки: " + result + "</b><br>";

	if (params.stairModel != 'Прямая') {
		resultText += `Длинна проема: ${params.floorHoleLength} < Размер марша: ${window.thirdMarshSize}<br>`;
		if (params.stairModel == 'П-образная трехмаршевая') {
			resultText += `Ширина проема: ${params.floorHoleWidth} < Размер марша: ${window.secondMarshSize}<br>`;
		}
	}

	$("#compareResultDiv").html(resultText);

	//submitTesting(isTestOk, "геометрия");


} //end of compareDimensions
