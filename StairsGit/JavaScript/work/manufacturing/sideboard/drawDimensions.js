function drawDimensoins(){
var par = {
	mesh: new THREE.Object3D(),
	}

	var modelDim = getModelDimensions();
	var zeroX = -(modelDim.sideWall.newellSize + modelDim.countertop.ledge)

//размеры боковины
	
//глубина шкафа номинальная

var dimPar = {
	p1: {x: -modelDim.sideWall.newellSize - 1, y: 0, z: 0},
	p2: {x: -modelDim.sideWall.newellSize - 1, y: 0, z: params.depth},
	offset: 50,
	basePlane: "yz",
	baseAxis: "z",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//глубина шкафа внутренняя
var dimPar = {
	p1: {x: -modelDim.sideWall.newellSize - 1, y: 200, z: modelDim.sideWall.newellSize},
	p2: {x: -modelDim.sideWall.newellSize - 1, y: 200, z: params.depth - modelDim.sideWall.newellSize},
	offset: 50,
	basePlane: "yz",
	baseAxis: "z",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//высота филенки

var dimPar = {
	p1: {x: -modelDim.sideWall.newellSize - 1, y: modelDim.leg + modelDim.sideWall.botBeamSize, z: modelDim.sideWall.newellSize},
	p2: {x: -modelDim.sideWall.newellSize - 1, y: params.height - modelDim.sideWall.topBeamSize - modelDim.countertop.thk, z: modelDim.sideWall.newellSize},
	offset: 100,
	basePlane: "yz",
	baseAxis: "y",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);


//высота шкафа

var dimPar = {
	p1: {x: zeroX, y: 0, z: params.depth + 1},
	p2: {x: zeroX, y: params.height, z: params.depth + 1},
	offset: -100,
	basePlane: "xy",
	baseAxis: "y",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//ширина шкафа номинальная
var dimPar = {
	p1: {x: -modelDim.sideWall.newellSize, y: 0, z: params.depth + 1},
	p2: {x: -modelDim.sideWall.newellSize + params.width, y: 0, z: params.depth + 1},
	offset: 50,
	basePlane: "xy",
	baseAxis: "x",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//ширина шкафа внутренняя
var dimPar = {
	p1: {x: 0, y: 200, z: params.depth + 1},
	p2: {x: params.width - modelDim.sideWall.newellSize * 2, y: 200, z: params.depth + 1},
	offset: 50,
	basePlane: "xy",
	baseAxis: "x",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//ширина шкафа по столешнице
var fullWidth = params.width + modelDim.countertop.ledge * 2;
var dimPar = {
	p1: {x: zeroX, y: params.height, z: params.depth + modelDim.countertop.ledge},
	p2: {x: zeroX + fullWidth, y: params.height, z: params.depth + modelDim.countertop.ledge},
	offset: 100,
	basePlane: "xy",
	baseAxis: "x",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);

//глубина шкафа по столешнице
var fullDepth = params.width + modelDim.countertop.ledge * 2;

var dimPar = {
	p1: {x: zeroX, y: params.height, z: -modelDim.countertop.ledge},
	p2: {x: zeroX, y: params.height, z: params.depth + modelDim.countertop.ledge},
	offset: 100,
	basePlane: "yz",
	baseAxis: "z",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
par.mesh.add(dim);


return par;

}//end of drawDimensoins

