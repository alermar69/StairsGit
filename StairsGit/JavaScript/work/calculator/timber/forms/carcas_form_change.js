function changeFormCarcas(){
var i; //счетчик цикла - служебная переменная
var j; //счетчик цикла - служебная переменная
$("#nose").val(20);
getAllInputsValues(params);

//задаем свес ступени
var nose = 20;
$("#a1").val(params.b1 + nose);
$("#a2").val(params.b2 + nose);
$("#a3").val(params.b3 + nose);

$("#treadsParams").show();

var stairModel = params.stairModel;

//зазор между маршами в плане
if(params.model == "тетивы" && 
	(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") &&
	params.marshDist < 55){
		var delta = 55 - params.marshDist;
			var message = "ВНИМАНИЕ! \n" + 
				"Невозможно изготовление лестницы на тетивах с зазором между маршами менее 55мм. \n" + 
				"Зазор увеличен до 55мм \n" + 
				"Ширина маршей уменьшена с " + params.M + " до " + (params.M - delta / 2) + " мм";
			alertTrouble(message);
			$("#marshDist").val(55);
			$("#M").val(params.M - delta / 2);
			getAllInputsValues(params);
		}


var model = params.model;


/*колонны*/
var columnModel = params.columnModel;

if (columnModel != "нет") {
	document.getElementById('columnPos_tr').style.display = "table-row";
	}
else {
	document.getElementById('columnPos_tr').style.display = "none";
	}

/*скрываем все чекбоксы*/
for (var i=1; i<9; i++) {
	var trId = "isColumn" + i + "_label";
	document.getElementById(trId).style.display = "none";
	}


var posCompatible = [];
if (stairModel == "Прямая") {
	maxColumnAmt = 2;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/001.jpg";
	}
if (stairModel == "Г-образная с площадкой") {
	maxColumnAmt = 4;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/002.jpg";
	}
if (stairModel == "Г-образная с забегом") {
	maxColumnAmt = 4;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/003.jpg";
	}
if (stairModel == "П-образная с площадкой") {
	maxColumnAmt = 7;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/004.jpg";
	}
if (stairModel == "П-образная с забегом") {
	maxColumnAmt = 7;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/005.jpg";
	}
if (stairModel == "П-образная трехмаршевая") {
	maxColumnAmt = 8;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/006.jpg";
	}

for (var i=1; i < maxColumnAmt+1; i++) {
	var trId = "isColumn" + i + "_label";
	document.getElementById(trId).style.display = "";
	}

/*зазор от стены по умолчанию*/
if (model == "тетивы") document.getElementById('wallDist').value = 10;
if (model == "косоуры") document.getElementById('wallDist').value = 40;

$('#treadColorNumber option[value="как на лестнице"]').hide();
$('#carcasColorNumber option[value="как на лестнице"]').hide();

} //конец функции changeFormCarcas()


function setTemplateCarcas() {
var template = document.getElementById('template').options[document.getElementById('template').selectedIndex].value;
var stairType = document.getElementById('stairType').options;
var metalPaint = document.getElementById('metalPaint').options;
var timberPaint = document.getElementById('timberPaint').options;
var install = document.getElementById('install').options;


if (template == "дерево 1") {
stairType[3].selected="true";
metalPaint[2].selected="true";
timberPaint[2].selected="true";
install[1].selected="true";
}
if (template == "дерево 2") {
stairType[2].selected="true";
metalPaint[2].selected="true";
timberPaint[1].selected="true";
install[0].selected="true";
}

if (template == "дерево 3") {
stairType[1].selected="true";
metalPaint[2].selected="true";
timberPaint[0].selected="true";
install[0].selected="true";
}
if (template == "дерево 4") {
stairType[0].selected="true";
metalPaint[0].selected="true";
timberPaint[0].selected="true";
install[0].selected="true";
}
}// end of setTemplateCarcas