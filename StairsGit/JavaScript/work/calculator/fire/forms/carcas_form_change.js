
function changeFormCarcas(){
getAllInputsValues(params);

//параметры маршей 600 и 800мм
$(".params_600_tr").hide();
$(".params_800_tr").hide();

if(params.staircaseType == "П-1.1" || params.staircaseType == "две") $(".params_600_tr").show();
if(params.staircaseType == "П-1.2" || params.staircaseType == "две") $(".params_800_tr").show();

//обнуляем инпуты параметров
if(params.staircaseType == "П-1.1") $(".params_800").val(0);
if(params.staircaseType == "П-1.2") $(".params_600").val(0);

//верхняя секция при наличии площадки

if(params.pltAmt_600 != 0 && params.pltAmt_600 != topSectionAmt_600_05 / 2) {
	$("#topSectionAmt_600_05").val(params.pltAmt_600 * 2);
	//alert("На каждую верхнюю площадку надо 2 верхние секции! Количество верхних секций будет изменено.")
	}
	
if(params.pltAmt_800 != 0 && params.pltAmt_800 != topSectionAmt_800_05 / 2) {
	$("#topSectionAmt_800_05").val(params.pltAmt_800 * 2);
	//alert("На каждую верхнюю площадку надо 2 верхние секции! Количество верхних секций будет изменено.")
	}
		
/*покраска металла*/
$('.metalColor').hide();
if(params.metalPaint == "порошок") $('.metalColor').show();

}