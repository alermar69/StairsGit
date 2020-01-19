function changeFormRailing(){


	


/*Характеристики ограждений*/

//наличие ограждений
var isRailing = staircaseHasUnit().railing;

//наличие поручней
var isHandrail = staircaseHasUnit().sideHandrails; //функция в файле inputsReading
if(isRailing && params.handrail != "нет") isHandrail = true;




var railingModel = document.getElementById('railingModel').options[document.getElementById('railingModel').selectedIndex].value;

$("#rackBottom_tr").show();

if (railingModel == "Самонесущее стекло") {
	document.getElementById('glass_tr_1').style.display = "table-row";
	//document.getElementById('rackBottom_bal_tr').style.display = "table-row";
	$("#rackBottom_tr").hide();
	}
else {
	document.getElementById('glass_tr_1').style.display = "none";
	
	}

if (railingModel == "Ригели") {
	document.getElementById('rigel_tr_1').style.display = "table-row";
	document.getElementById('rigel_tr_2').style.display = "table-row";	
	}
else {
	document.getElementById('rigel_tr_1').style.display = "none";
	document.getElementById('rigel_tr_2').style.display = "none";
}

if (railingModel == "Кованые балясины") {
	document.getElementById('kovka_tr_1').style.display = "table-row";
	document.getElementById('kovka_tr_2').style.display = "table-row";
	document.getElementById('kovka_tr_3').style.display = "table-row";
	document.getElementById('kovka_tr_4').style.display = "table-row";
	}
else {
	document.getElementById('kovka_tr_1').style.display = "none";
	document.getElementById('kovka_tr_2').style.display = "none";
	document.getElementById('kovka_tr_3').style.display = "none";
	document.getElementById('kovka_tr_4').style.display = "none";
}

$(".timberRailing_tr").hide();
if (railingModel == "Деревянные балясины") $(".timberRailing_tr").show();
	

	
if (railingModel == "Ригели" || railingModel == "Стекло на стойках")
	document.getElementById('banisterMaterial_tr').style.display = "table-row";	
else document.getElementById('banisterMaterial_tr').style.display = "none";

/*выбор поручней*/
setHandrailOptions(); //функция в файле formsChange



	if(params.handrail == "Ф50 нерж. с пазом" || params.handrail == "40х60 нерж. с пазом"){
		params.handrailFixType = "паз";
		$("#handrailFixType").val(params.handrailFixType);
		}

} //end of changeForm

