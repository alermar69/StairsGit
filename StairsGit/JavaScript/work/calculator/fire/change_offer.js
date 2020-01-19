function changeOffer() {

var staircaseType = params.staircaseType;


/*меняем главное описание*/
if (staircaseType == "П-1.1") {
	document.getElementById('mainImages').innerHTML = 
	"<h2>Общий вид лестницы:</h2>" + 
	"<a href='/images/fire/005.jpg' rel='fancy'><img src='/images/fire/005.jpg'></a>" + 
	"<a href='/images/fire/006.jpg' rel='fancy'><img src='/images/fire/006.jpg'></a>" + 
	"<a href='/images/fire/007.jpg' rel='fancy'><img src='/images/fire/007.jpg'></a>" + 
	"<a href='/images/fire/008.jpg' rel='fancy'><img src='/images/fire/008.jpg'></a>";
}

if (staircaseType == "П-1.2") {
	document.getElementById('mainImages').innerHTML = 
	"<h2>Общий вид лестницы:</h2>" + 
	"<a href='/images/fire/004.jpg' rel='fancy'><img src='/images/fire/004.jpg'></a>" + 
	"<a href='/images/fire/002.jpg' rel='fancy'><img src='/images/fire/002.jpg'></a>" + 
	"<a href='/images/fire/003.jpg' rel='fancy'><img src='/images/fire/003.jpg'></a>" + 
	"<a href='/images/fire/001.jpg' rel='fancy'><img src='/images/fire/001.jpg'></a>";
}

if (staircaseType == "две") {
	document.getElementById('mainImages').innerHTML = 
	"<h2>Общий вид лестницы:</h2>" + 
	"<a href='/images/fire/004.jpg' rel='fancy'><img src='/images/fire/004.jpg'></a>" + 
	"<a href='/images/fire/002.jpg' rel='fancy'><img src='/images/fire/002.jpg'></a>" + 
	"<a href='/images/fire/005.jpg' rel='fancy'><img src='/images/fire/005.jpg'></a>" + 
	"<a href='/images/fire/005.jpg' rel='fancy'><img src='/images/fire/006.jpg'></a>";
}

//покраска
var paintDescript = "";
if(params.metalPaint == "нет") paintDescript = "Для экономии, лестница поставляется без покрытия"
if(params.metalPaint == "грунт") paintDescript = "Лестница прокрывается антикоррозионным грунтом ГФ-021"
if(params.metalPaint == "порошок") paintDescript = "Лестница покрывается прочтной и долговечной порошковой краской"
if(params.metalPaint == "цинк") paintDescript = "Надежное долговечное покрытие горячим цинкованием;"

$("#paintDescript").html(paintDescript);

//монтаж
var assemblingDescript = "Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа;"
if(params.isAssembling == "есть") 
	var assemblingDescript = "Монтаж лестницы производится бригадой аттестованных промышленных альпинистов;"
	
$("#assemblingDescript").html(assemblingDescript);	

//испытания

$("#testingDescript").hide();
if(params.isTesting == "да") $("#testingDescript").show();




}