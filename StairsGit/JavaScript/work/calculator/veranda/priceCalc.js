//var costMarkup = 1.3; //07.05.20;
//var costMarkup = 1.56; //11.01.21
var costMarkup = 1.6; //31.03.21

/** функия обертка для совместимости с общей структурой **/
function calculateCarcasPrice(){
	
	//навес
	calcCarportCost()
	
	//площадка - приблизительный расчет
	staircaseCost.platform = 0;
	if(params.pltType == "отдельная"){
		staircaseCost.platform = params.pltLen * params.pltWidth / 1000000 * 3000; //3тыс/м2
		staircaseCost.carcas += staircaseCost.platform
	}
	
	//лестница
	calMetalStairCost()
	
};