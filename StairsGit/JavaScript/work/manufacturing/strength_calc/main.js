var params = {}; //глобальный массив значений инпутов
var staircasePrice = {};
var partsAmt = {};
var priceObj = {};

$(function () {
	setProfiles();
	
	changeFormCarcas()
	recalculate()
});

function recalculate(){
	getAllInputsValues(params)
	
	var text = "<h3>Результаты расчета: </h3>";
	
	//расчет балки
	if(params.calcMode == "балка" || params.calcMode == "балка многопролетная"){	
		
		var beamPar = {
			len: params.len,
			prof: params.beam1,
			load_m: params.load_m,
			load_p: params.load_p,
			customIx: params.beamIx_1,
		}
		
		if(params.calcMode == "балка многопролетная") beamPar.spanAmt = params.spanAmt;

		text += getBeamCalcText(beamPar)
	
	}
	
	if(params.calcMode == "площадка"){
		text += calcPlt();
	}
	
	$("#result").html(text)
}

function changeFormCarcas(){
	getAllInputsValues(params)
	
	$(".plt").hide()
	$(".beam").hide()
	$(".multiSpan").hide()
	

	
	$("#beamIx_1").closest("tr").hide()
	$("#beamIx_2").closest("tr").hide()
	
	
	if(params.calcMode == "балка" || params.calcMode == "балка многопролетная"){
		$(".beam").show()
	}
	
	if(params.calcMode == "площадка"){
		$(".plt").show()
	}
	
	if(params.beam1 == "ввести Ix") $("#beamIx_1").closest("tr").show()
	if(params.beam2 == "ввести Ix") $("#beamIx_2").closest("tr").show()
	if(params.calcMode == "балка многопролетная") $(".multiSpan").show()
		
	recalculate()
	
}

/** функция добавлет в селекты известные профили
*/
function setProfiles(){
	var profParams = getProfStrengthPar();
	var text = ""
	for(var name in profParams){
		text += "<option value='" + name + "'>" + name + "</option>";
	}
	
	text += "<option value='ввести Ix'>ввести Ix</option>";
	
	$("#beam1").append(text)
	$("#beam2").append(text)
}

