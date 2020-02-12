function calcRacksBolzs(par) {
	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	par.a = marshPar.a;
	par.b = marshPar.b;
	par.h = marshPar.h;
	par.stairAmt = marshPar.stairAmt;

	var rackProfile = 40;

	var offsetX = (params.nose - rackProfile) / 2 + rackProfile / 2;

	ltko_set_railing(par.stairAmt + 1, par);

	//первая стойка
	var rack = { x: offsetX, y: par.h }
	par.racks.push(rack);

	//среднии стойки
	for (var i = 0; i < par.railing.length; i++) {
		var rack = { x: offsetX + par.b * (par.railing[i] - 1), y: par.h * par.railing[i] }
		par.racks.push(rack);
	}

	//последняя стойка
	var rack = { x: offsetX + par.b * (par.stairAmt - 1), y: par.h * par.stairAmt }
	if (marshPar.topTurn == 'пол') {
		rack.x += calcLastRackDeltaY() / Math.tan(marshPar.ang);
	}
	if (params.stairModel == "П-образная с площадкой" && par.marshId == 1) {
		rack = newPoint_xy(rack, par.b, par.h);
	}
	else {
		if (marshPar.topTurn !== 'пол') {
			if (params.stairModel == "П-образная с забегом" && params.marshDist !== 0) {
				rack = newPoint_xy(rack, par.b, par.h + marshPar.h_topWnd * 2);
			}
			else {
				rack.noDraw = true;
				rack.dxToMarshNext = marshPar.b + 20;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1) {
					rack = newPoint_xy(rack, par.b, par.h);
					rack.noDraw = true;
					rack.dxToMarshNext = 20;
				}
			}
		}
	}
	par.racks.push(rack);

	return par;
}