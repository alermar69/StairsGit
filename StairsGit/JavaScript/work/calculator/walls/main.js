window.onload = function () {
	initStats();
	addViewports ("WebGL-output");
	recalculate();
}

function recalculate() {
	addWall('viewPort1');
	//addFloorHole('viewPort2')
}