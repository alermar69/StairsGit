$(function () {
	loadFont();

	//Добавляем слои в 3Д меню
	layers = {
		treads: "Ступени",
		risers: "Подступенки",
		dimensions: "Размеры",
		helper: 'Helper',
		carcas: 'carcas',
	}
	for(var layer in layers){
		addLayer(layer, layers[layer]);
	}

	checkOrder = function(){

		var orderName = $('#orderName').val();
		if(!orderName) {
			alert('Чтобы перейти в расчет цены необходимо сначала сохранить расчет в базу.');
			return;
		}
		
		switch($('#staircaseType').val()){
			case 'metal':
				window.open('/calculator/metal/?orderName='+orderName);
				break;
			case 'metal':
				window.open('/calculator/metal/?orderName='+orderName);
				break;
			case 'timber_stock':
				window.open('/calculator/timber_stock/?orderName='+orderName);
				break;
			case 'vint':
				window.open('/calculator/vint/?orderName='+orderName);
				break;
			case 'vhod':
				window.open('/calculator/vhod/?orderName='+orderName);
				break;
			case 'mono':
				window.open('/calculator/mono/?orderName='+orderName);
				break;
			default:
				alert('Тип расчета не указан или отсутствует!');
			break;

		};
	};

	$('#resizeDrawings').click(function(){
		if($(this).text() == "Уменьшить"){
			$("#drawings img").css({"width": "48%"})
			$(this).text("Увеличить")
		}
		else {
			$("#drawings img").css({"width": "100%"})
			$(this).text("Уменьшить")
		}
	});

	$('#calc_price').click(function(){
		checkOrder();
	});

	recalculate();

});

preLoadFont = function(callback){
	if (fontGlob) {
		callback();
		return;
	}
	//console.log('3D Font loading start');
	var loader = new THREE.FontLoader();
	if (!fontGlob) {
		//Загружаем шрифты
		var mesh = loader.load( '/calculator/general/three_libs/font.json', function ( font ) {
			fontGlob = font; // После загрузки шрифтов загружаем текста
			if (fontGlob) {
				//console.log('3D Font loading end, treads rendering started');
				callback();
			}
		});
	}
};

$('#makeDrawings').click(function(){
	makeDrawings();
});

$('#printInstallationContract').click(function(){
	makeDrawings(function(){
		var drawings = $("#drawings")[0].outerHTML;
		var text = drawings;
		text += "<br>1.Необходимо обеспечить возможность беспрепятственно пронести к месту установки и складировать элементы Изделия размером 3х1х0,5м.п.<br>\
		<br>\
		2.Обеспечить подвод электричества (220 В) для подключения оборудования или инструмента (мощность до 3 кВт) и освещения на место проведения Работ;<br>\
		<br>\
		3.Общестроительные работы в зоне установки Изделия должны быть завершены или приостановлены на время сборки и установки;<br>\
		<br>\
		4.Отсутствие скрытых коммуникаций, теплых полов, прочих инженерных систем в месте установки несущих элементов лестницы. Подрядчик не несет ответственности за повреждение скрытых коммуникаций.<br>\
		<br>\
		5. До начала монтажных работ необходимо демонтировать все ранее смонтированные и временные конструкции, которые создают помехи для проведения работ Подрядчиком (если эти Работы не включены в смету Подрядчика)<br>\
		<br>\
		6.Перекрытия и стены, к которым планируется закреплять несущие элементы лестницы, должны обладать достаточной прочностью, чтобы выдержать нагрузку от установки анкерных элементов и веса площадок или прочих лестничных элементов;<br>\
		<br>\
		7.На время установки каркаса лестницы, полы, потолки, стены; фасадные или архитектурные элементы, а также окна и двери, которые имеют финишную или чистовую отделку, должны быть укрыты соответствующим материалом для предотвращения их возможного повреждения при проведении Работ, в противном случае Подрядчик не несет ответственности за их повреждение.<br>\
		<br>\
		8. Заказчик не вправе привлекать для выполнения Работ, предусмотренных настоящим Договором, без согласования с Подрядчиком, иных лиц, если со стороны Подрядчика нет нарушений сроков и качества проводимых работ.";

		var docHeader = "<!DOCTYPE html><html><head><title>Строительное задание</title><link rel='stylesheet' type='text/css' href='templates/theme.css'></head><body><div class='documentDiv'><h1 style='text-align: center;'>Строительное задание</h1>";
		var docFooter = "</body></html>"
		
		var mywindow = window.open('', '_blank'); 
		mywindow.document.write(docHeader); 
		mywindow.document.write(text); 
		mywindow.document.write(docFooter);
		mywindow.document.close();
		mywindow.focus();
		mywindow.setTimeout(mywindow.print, 1000);
	})
});

function recalculate() {
	try {
		window.ladderLoaded = false;
		changeAllForms();
		calculateGeom();
		preLoadFont(()=>{
			drawStaircase('vl_1', true);
			// makeDrawings();
		});
		showAlerts = true;
		redrawWalls();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
};




function changeAllForms(){
	getAllInputsValues(params);
	changeFormsGeneral();
	changeForm();
	changeGeometryForms();
};

function configDinamicInputs() {
		changeFormTopFloor();
		changeFormLedges();
		changeAllForms();
	}
