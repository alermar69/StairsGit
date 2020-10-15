var workList = {};

$(function () {
	$("#production_data, #orderOffers").delegate(".deptTime", "click", function(){
		$(this).find(".deptTimeInfo").slideToggle('200');
	})
	
	//печать активной вкладки с расчетом трудоемкости/расценок
	$("#production_data").delegate("#printWorksTab-btn", "click", function(){
		var $activeTab = $("#production_data .tab-pane.active")
		var text = $activeTab.html();
		if($activeTab.attr("id") == "works_metal" || $activeTab.attr("id") == "works_timber"){
			text = $("#descr").html() + text + $("#materialNeed").html();
		}
		
		var docHeader = "<!DOCTYPE html><html><head><title>Расчетная трудоемкость заказа " + params.orderName + "</title><link rel='stylesheet' type='text/css' href='/bitrix/templates/calc/styles.css'></head><body>" + 
		"<div class='documentDiv'>\
			<h2>Расчетная трудоемкость заказа " + params.orderName + "</h2>";
		var docFooter = "</body></html>"
		
		var mywindow = window.open('', '_blank'); 
		mywindow.document.write(docHeader); 
		mywindow.document.write(text); 
		mywindow.document.write(docFooter);
		mywindow.document.close(); // necessary for IE >= 10 
		mywindow.focus(); // necessary for IE >= 10 
		mywindow.setTimeout(mywindow.print, 1000);
		
	})
	
	
});


/** функция инициализирует справочник для расчета трудоемкости производства*/

function crateWorksList(){

workList = {
	timber: {
		deptName: "Столярный цех",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 300,
		outputDivId: "works_timber",
		},
	metal: {
		deptName: "Металлический цех",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 300,
		outputDivId: "works_metal",
		},
	plasma: {
		deptName: "Плазма",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 300,
		outputDivId: "works_metal",
		},
	cnc: {
		deptName: "Фрезер чпу",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 300,
		outputDivId: "works_timber",
		},
	powder: {
		deptName: "Порошковая покраска",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 300,
		outputDivId: "works_metal",
		},
	painting: {
		deptName: "Покраска дерева",
		totalPrice: 0,
		totalTime: 0,
		totalWage: 0,
		hourCost: 400,
		outputDivId: "works_timber",
		},
	assembling: {
		deptName: "Монтаж",
		totalPrice: 0,
		totalTime: 0,
		hourCost: 300,
		},
	other: {
		deptName: "Прочее",
		totalPrice: 0,
		totalTime: 0,
		hourCost: 300,
		},
	}


	
//плазма
	{
	workList.plasma.largeParts = {
		name: "Изготовление крупных деталей",
		amtId: "area",
		amtName: "м2",
		startTime: 0, //было 15
		unitTime: 15,
		amt: 0,
		}
	workList.plasma.smallPart = {
		name: "Изготовление мелких деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 0,//было 15,
		unitTime: 2,
		amt: 0,
		}
	}
	
//металл
	{
	workList.metal.sheet = {
		name: "Обработка деталей из листа",
		amtId: "area",
		amtName: "м2",
		startTime: 10,
		unitTime: 40,
		amt: 0,
		}
		
	workList.metal.frame = {
		name: "Изготовление рамок",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 10,
		amt: 0,
		}
	
	workList.metal.wndFrame = {
		name: "Изготовление забежных рамок",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 20,
		amt: 0,
		}
	
	workList.metal.column = {
		name: "Изготовление колонн",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 15,
		amt: 0,
		}
	
	workList.metal.brace = {
		name: "Изготовление подкосов",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 20,
		amt: 0,
		}
	
	workList.metal.pole = {
		name: "Изготовление погонажных деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 1,
		amt: 0,
		}
	
		
	workList.metal.racks = {
		name: "Изготовление стоек черн.",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 10,
		amt: 0,
		}
		
	workList.metal.inoxRack = {
		name: "Изготовление стоек нерж.",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 20,
		amt: 0,
		}
		
	workList.metal.vintBal = {
		name: "Изготовление стоек 20х20",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 10,
		amt: 0,
		}
	
		
	workList.metal.forgedSection = {
		name: "Изготовление кованых секций",
		amtId: "amt", //лучше использовать погонные метры
		amtName: "шт",
		startTime: 20,
		unitTime: 40,
		amt: 0,
		}
	
	workList.metal.lathePart = {
		name: "Изготовление точеных деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 20,
		unitTime: 8,
		amt: 0,
		}
	
	workList.metal.pvcHandrail = {
		name: "Изготовление винтового поручня ПВХ",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 60,
		unitTime: 30,
		amt: 0,
		}
		
	workList.metal.monoStringer = {
		name: "Изготовление монокосоуров",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 30,
		unitTime: 60 * 8 * 2 / 6, //6 метров за полный день двух человек
		amt: 0,
		}
		
	workList.metal.pltFrame = {
		name: "Изготовление рамки площадки",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 60 * 1.5,
		amt: 0,
		}
		
	workList.metal.treadPlateWld = {
		name: "Изготовление сварных подложек",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 10,
		amt: 0,
		}
	}
		
//порошок
	{
	workList.powder.sheet = {
		name: "Покраска плоских деталей",
		amtId: "area",
		amtName: "м2",
		startTime: 10,
		unitTime: 10,
		amt: 0,
		}
	
	workList.powder.smallPart = {
		name: "Покраска мелких деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 2,
		unitTime: 1,
		amt: 0,
		}
	
	workList.powder.frame = {
		name: "Покраска рамок",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 2,
		amt: 0,
		}
	
	workList.powder.brace = {
		name: "Покраска подкосов",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 5,
		amt: 0,
		}
	
	workList.powder.bolt = {
		name: "Покраска болтов",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 0.1,
		amt: 0,
		}
		
	workList.powder.pole = {
		name: "Покраска погонажных деталей",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 1,
		unitTime: 1,
		amt: 0,
		}
		
	workList.powder.racks = {
		name: "Покраска стоек ограждений",
		amtId: "amt",
		amtName: "шт",
		startTime: 2,
		unitTime: 1,
		amt: 0,
		}
		
	workList.powder.forgedSection = {
		name: "Покраска кованых секций",
		amtId: "amt",
		amtName: "шт",
		startTime: 20,
		unitTime: 20,
		amt: 0,
		}
	
	workList.powder.monoStringer = {
		name: "Покраска монокосоуров",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 15,
		unitTime: 20,
		amt: 0,
		}

	workList.powder.pltFrame = {
		name: "Покраска рамки площадки",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 10,
		amt: 0,
		}
		
	workList.powder.treadPlateWld = {
		name: "Покраска сварных подложек",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 5,
		amt: 0,
		}
	}
		
//столярка
	{
	workList.timber.rect = {
		name: "Изготовление прямоугольных деталей",
		amtId: "area",
		amtName: "м2",
		startTime: 15,
		unitTime: 2+5+15,
		amt: 0,
		}
	
	workList.timber.winder = {
		name: "Обработка забежных ступеней после чпу",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 25,
		amt: 0,
		}
		
	workList.timber.cncPart = {
		name: "Обработка криволинейных деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 30,
		amt: 0,
		}
		
	workList.timber.riser_arc = {
		name: "Изготовление гнутого подступенка",
		amtId: "amt",
		amtName: "шт",
		startTime: 5,
		unitTime: 2.5*60,
		amt: 0,
		}
	
	workList.timber.skirting = {
		name: "Изготовление плинтуса",
		amtId: "amt",
		amtName: "шт",
		startTime: 15,
		unitTime: 5,
		amt: 0,
		};
		
	workList.timber.smallPart = {
		name: "Изготовление мелких деталей",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 10,
		amt: 0,
		}
		
		
		
	workList.timber.stringer_T = {
		name: "Обработка тетив после ЧПУ",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 10,
		unitTime: 25,
		amt: 0,
		}
		
	workList.timber.stringer_K = {
		name: "Обработка косоуров после ЧПУ",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 10,
		unitTime: 0.8*60, //0,8 метра в час
		amt: 0,
		}
		
	workList.timber.handrail = {
		name: "Изготовление поручня",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 10,
		unitTime: 15,
		amt: 0,
		}
	
	workList.timber.slotHandrail = {
		name: "Изготовление поручня с пазом",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 30,
		unitTime: 20,
		amt: 0,
		}
	
	workList.timber.spiralHandrail = {
		name: "Изготовление винтового поручня",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 60*1.5*3 + 8 * 60 * 2 * 1.5, //1,5 часа трех человек настройка стапеля, 1,5 дня человек подгонка стыков
		unitTime: 60 *2,
		amt: 0,
		}
	

	workList.timber.latheBanister = {
		name: "Изготовление точеных балясин",
		amtId: "amt",
		amtName: "шт",
		startTime: 10,
		unitTime: 10,
		amt: 0,
		}
	
	workList.timber.rectBanister = {
		name: "Изготовление квадратных балясин",
		amtId: "amt",
		amtName: "шт",
		startTime: 40,
		unitTime: 15,
		amt: 0,
		}
		
	workList.timber.latheNewell = {
		name: "Изготовление точеных столбов",
		amtId: "amt",
		amtName: "шт",
		startTime: 40,
		unitTime: 10,
		amt: 0,
		}
	
		
	workList.timber.vint = {
		name: "Обработка винтовых ступеней после ЧПУ",
		amtId: "amt",
		amtName: "шт",
		startTime: 20,
		unitTime: 10,
		amt: 0,
		}
	
	workList.timber.drawerPart = {
		name: "Изготовление деталей ящиков",
		amtId: "amt",
		amtName: "шт",
		startTime: 20,
		unitTime: 10,
		amt: 0,
		}
	
	workList.timber.framedDoor = {
		name: "Изготовление рамочных фасадов",
		amtId: "amt",
		amtName: "шт",
		startTime: 20,
		unitTime: 3 * 60,
		amt: 0,
		}
	}

//чпу фрезер
	{
	workList.cnc.tread = {
		name: "Изготовление ступеней",
		amtId: "amt",
		amtName: "шт",
		startTime: 30,
		unitTime: 15,
		amt: 0,
		}
		
	workList.cnc.skirting = {
		name: "Изготовление плинтусов",
		amtId: "amt",
		amtName: "шт",
		startTime: 30,
		unitTime: 5,
		amt: 0,
		}
	}
	
//малярка
	{
	var paintingFactor = 1.25; //к-т на покраску с морилкой
	if(params.timberPaint && params.timberPaint.indexOf("патина") != -1) paintingFactor = 1.4;
	var timeFactor = 0.7; //поправочный коэффициент
	
	workList.painting.plane = {
		name: "Покраска плоских поверхностей (лак/масло)",
		amtId: "paintedArea",
		amtName: "м2",
		startTime: 40 * timeFactor,
		unitTime: 40 * timeFactor,
		amt: 0,
		unitWage: 60,
		paintingFactor: 0,
		}
		
	workList.painting.plane_col = {
		name: "Покраска плоских поверхностей (морилка + лак/масло)",
		amtId: "paintedArea",
		amtName: "м2",
		startTime: 50 * timeFactor,
		unitTime: 60 * timeFactor,
		amt: 0,
		unitWage: workList.painting.plane.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
		
	workList.painting.riser_arc = {
		name: "Покраска гнутых подступенков (лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 60 * timeFactor,
		amt: 0,
		unitWage: 100,
		paintingFactor: 0,
		}
		
	workList.painting.riser_arc_col = {
		name: "Покраска гнутых подступенков (морилка + лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 80 * timeFactor,
		amt: 0,
		unitWage: workList.painting.riser_arc.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
	
	workList.painting.smallPart = {
		name: "Покраска мелких деталей (лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 10 * timeFactor,
		unitTime: 12 * timeFactor,
		amt: 0,
		unitWage: 20,
		paintingFactor: 0,
		}
		
	workList.painting.smallPart_col = {
		name: "Покраска мелких деталей (морилка + лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 10 * timeFactor,
		unitTime: 18 * timeFactor,
		amt: 0,
		unitWage: workList.painting.smallPart.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
		
	workList.painting.handrail = {
		name: "Покраска поручня прямого (лак/масло)",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 5 * timeFactor,
		unitTime: 12 * timeFactor,
		amt: 0,
		unitWage: 15,
		paintingFactor: 0,
		}
	
	workList.painting.handrail_col = {
		name: "Покраска поручня прямого (морилка + лак/масло)",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 5 * timeFactor,
		unitTime: 18 * timeFactor,
		amt: 0,
		unitWage: workList.painting.handrail.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
		
		
	workList.painting.spiralHandrail = {
		name: "Покраска поручня спирального (лак/масло)",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 5 * timeFactor,
		unitTime: 25 * timeFactor,
		amt: 0,
		unitWage: 20,
		paintingFactor: 0,
		}
	
	workList.painting.spiralHandrail_col = {
		name: "Покраска поручня спирального (морилка + лак/масло)",
		amtId: "sumLength",
		amtName: "м.п.",
		startTime: 5 * timeFactor,
		unitTime: 35 * timeFactor,
		amt: 0,
		unitWage: workList.painting.spiralHandrail.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
		
	workList.painting.banister = {
		name: "Покраска балясин (лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 10 * timeFactor,
		amt: 0,
		unitWage: 25,
		paintingFactor: 0,
		}
		
	workList.painting.banister_col = {
		name: "Покраска балясин (морилка + лак)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 15 * timeFactor,
		amt: 0,
		unitWage: workList.painting.banister.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
		
	workList.painting.latheNewell = {
		name: "Покраска столбов (лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 15 * timeFactor,
		amt: 0,
		unitWage: 40,
		paintingFactor: 0,
		}
		
	workList.painting.latheNewell_col = {
		name: "Покраска столбов (морилка + лак/масло)",
		amtId: "amt",
		amtName: "шт",
		startTime: 5 * timeFactor,
		unitTime: 20 * timeFactor,
		amt: 0,
		unitWage: workList.painting.latheNewell.unitWage * paintingFactor,
		paintingFactor: paintingFactor,
		}
	}
	
	//для каждой позиции задаем объем в нормо-метрах
	$.each(workList.painting, function(){
		this.standartUnits = Math.round(this.unitWage / workList.painting.plane.unitWage * 100) / 100;
	})
	
	$("#works_log").html("")
		
		
}//end of crateWorksList


/** функция возвращает id работ для каждого участка по id детали
*/

function getWorkId(partId){

	var metal = false;
	var powder = false;
	var timber = false;
	var painting = false;
	var plasma = false;
	var cnc = false;

//плоские детали из листа
	
	if(partId == "stringer" ||
		partId == "pltStringer" ||
		partId == "bridge" ||
		partId == "carcasFlan" ||
		partId == "topFlan" ||
		partId == "stringerFlan" ||
		partId == "treadPlate" ||
		partId == "truss" ||
		partId == "rackFlan" ||
		partId == "trussSide" ||
		partId == "treadPlateWnd"		
		){
			metal = "sheet";
			powder = "sheet";
			plasma = {
				calcArea: true,
				smallPartsAmt: 0,
				}
			}
	if(params.calcType == "mono" && partId == "stringer"){
		metal = "monoStringer";
		powder = "monoStringer";
		}
	
//мелкие детали со склад с покраской

	if(partId == "carcasAngle" ||
		partId == "treadAngle" ||
		partId == "adjustableLeg" ||
		partId == "sideRackHolder" ||
		partId == "balAngle" ||
		partId == "lastRackFlan"		
		){
		metal = false;
		powder = "smallPart";
		}
		
	if(partId == "bolt"){
		metal = false;
		powder = "bolt";
		}
	
//рамки
	if(partId == "vertFrame" || partId == "treadFrame" || partId == "platformFrame"){
		metal = "frame";
		powder = "frame";
		plasma = {
			calcArea: false,
			smallPartsAmt: 4,
			}
		}
	if(partId == "wndFrame1" || partId == "wndFrame2" || partId == "wndFrame3" || partId == "wndFrame6"){
		metal = "wndFrame";
		powder = "frame";
		plasma = {
			calcArea: true,
			smallPartsAmt: 4,
			}
		}
	
	if(partId == "column" || partId == "carportColumn"){
		metal = "column";
		powder = "pole";
		plasma = {
			calcArea: false,
			smallPartsAmt: 2,
			}
		}
	if(partId == "brace" || partId == "midFix"){
		metal = "brace";
		powder = "brace";
		plasma = {
			calcArea: false,
			smallPartsAmt: 6,
			}
		}

	//сварные подложки монокосоуров
	if(partId == "treadPlateWld" || partId == "treadPlateWldWnd"){
		metal = "treadPlateWld";
		powder = "treadPlateWld";
		plasma = {
			calcArea: false,
			smallPartsAmt: 4,
			}
		}
	
	if(partId == "pltFrame"){
		metal = "pltFrame";
		powder = "pltFrame";
		}
	
	
	
	//детали винтовой лестницы
	if(partId == "botFlan" || partId == "topFlan" || partId == "regShim" || partId == "middleFlan"){
		powder = "smallPart";
		plasma = {
			calcArea: false,
			smallPartsAmt: 1,
			}
		}
		
	if(partId == "drum"){
		metal = "lathePart";
		powder = "smallPart";
	}
	
		
	if(partId == "purlinProf"){
		metal = "pole";
		powder = "pole";
	}
		
//ступени
	var treadType = getTreadParams().material;

	if(treadType == "metal"){
		if(partId == "tread"){			
			metal = "frame";
			powder = "frame";
			plasma = {
				calcArea: true,
				smallPartsAmt: 2,
				}
			}
		if(partId == "wndTread" || partId == "wndTreadMid" || partId == "vintTread" || partId == "vintPlatform"){
			metal = "wndFrame";
			powder = "frame";
			plasma = {
				calcArea: true,
				smallPartsAmt: 6,
				};
			}
		}
	
	if(treadType == "timber"){
		if(partId == "tread"){		
			timber = "rect";
			painting = "plane";
			}
		if(partId == "wndTread" || partId == "wndTreadMid"){
			timber = "winder";
			painting = "plane";
			cnc = "tread";
			}
		if(partId == "vintPlatform" || partId == "vintTread"){
			timber = "vint";
			painting = "plane";
			cnc = "tread";
			}
		}
	
		
//детали деревянный цех

	if(partId == "startTread" || partId == "notchedTread"){
		timber = "cncPart";
		painting = "plane";
		cnc = "tread";
		}
	if(partId == "riser" || partId == "topUnit"){
		timber = "rect";
		painting = "plane";
		}
	if(partId == "riser_arc"){
		timber = "riser_arc";
		painting = "riser_arc";
		}
	if(partId == "skirting_vert" || partId == "skirting_hor"){
		timber = "skirting";
		painting = "smallPart";
		cnc = "skirting";
		}
	
	if(partId == "stringer"){
		timber = "stringer_T";
		painting = "plane";
		cnc = "tread";
		}
		
	
	//детали ограждений
	if(partId == "handrails"){
		metal = "pole";
		powder = "pole";
		timber = "handrail";
		painting = "handrail";
		}

	if(partId == "rigels"){
		metal = "pole";
		powder = "pole";
		}
	
	if(partId == "racks" || partId == "turnRack"){
		metal = "racks";
		powder = "racks";
		timber = "rectBanister";
		painting = "banister";
		}
	
	if(partId == "bal"){
		metal = "vintBal";
		powder = "racks";
		}	
		
	
	if(partId == "forgedSection"){
		metal = "forgedSection";
		powder = "forgedSection";
		}
	if(partId == "spiralHandrail"){
		timber = "spiralHandrail";
		painting = "spiralHandrail";
		}
	if(partId == "pvcHandrail"){
		metal = "pvcHandrail";
		}
		
	if(partId == "latheBal" || partId == "timberBal"){
		timber = "latheBanister";
		painting = "banister";
		}
	
	if(partId == "latheNewell" || partId == "column" || partId == "turnNewell" || partId == "timberNewell"){
		timber = "latheNewell";
		painting = "latheNewell";
		}
	
	
	
/** детали мебели **/
	
	if(partId == "countertop" ||
		partId == "mdfPlate" ||		
		partId == "drawerBotPlate" ||
		partId == "shelf" ||
		partId == "door"){
			timber = "rect";
			painting = "plane";
			}
			
			
	if(partId == "framedDoor"){
		timber = "framedDoor";
		painting = "plane";
		}
			
			

	
	
	if(partId == "timberPole"){
		timber = "smallPart";
		painting = "plane";
		}
		
	if(partId == "sideBridge"){
		timber = "smallPart";
		painting = "smallPart";
		}
	
	if(partId == "drawerSidePlate" ||
		partId == "drawerFrontPlate"
		){
			timber = "drawerPart";
			painting = "plane";
			}
	
	
	
	var result = {
		metal: metal,
		plasma: plasma,
		powder: powder,
		timber: timber,
		painting: painting,
		cnc: cnc,
		}
	
	if(!metal && !powder && !timber && !painting && !plasma && !cnc) result = false;

	return result;


}


/** функция рассчитывает объем работы по каждой детали из спецификации и добавляет информацию о 
количестве в глобальный объект  workList
*/

function calcWorks(specObj, unit){

	var logText = "";
	var metalPaint = params.metalPaint;
	var timberPaint = params.timberPaint;
	/*
	if(unit == "banister"){
		metalPaint = params.metalPaint_perila_bal;
		if(metalPaint == "как на лестнице") metalPaint = params.metalPaint_perila;
		if(metalPaint == "как на лестнице") metalPaint = params.metalPaint;
		timberPaint = params.timberPaint;
		if(timberPaint == "как на лестнице") timberPaint = params.timberPaint_perila;
		if(timberPaint == "как на лестнице") timberPaint = params.timberPaint;
		}
	/*if(unit == "banister"){
		timberPaint = params.carcasPaint_wr;
		}
	*/

	for(var partId in specObj){
		var dept = specObj[partId].division;
		var workId = getWorkId(partId);
		
		
		//проверка ошибок

		if(!workId) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId<br/>";
		

		if(workId){
			//металл
			if(dept == "metal"){
				if(!workId.metal) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId.metal<br/>";
				else{
					//обработка в цеху
					var amtId = workList.metal[workId.metal].amtId;
					workList.metal[workId.metal].amt += specObj[partId][amtId];
					}
				if(!workId.plasma) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId.plasma<br/>";
				else{
					//плазма
					if(workId.plasma){
						//крупные детали
						if(workId.plasma.calcArea){
							if(!specObj[partId]["area"]) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет площадь для плазмы<br/>";
							else workList.plasma.largeParts.amt += specObj[partId]["area"];
							}
						//мелкие детали
						workList.plasma.smallPart.amt += workId.plasma.smallPartsAmt * specObj[partId]["amt"]
						}
					}				
				}
				
			//столярка
			if(dept == "timber"){
				if(!workId.timber) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId.timber<br/>";
				else{
					//обработка в цеху
					var amtId = workList.timber[workId.timber].amtId;
					workList.timber[workId.timber].amt += specObj[partId][amtId];
					
					//чпу
					if(workId.cnc){
						workList.cnc[workId.cnc].amt += specObj[partId][amtId];
						}
					}				
				}
			
			//порошок
			if(specObj[partId].metalPaint && metalPaint != "нет"){
				if(!workId.powder) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId.powder<br/>";
				else{
					var amtId = workList.powder[workId.powder].amtId;
					workList.powder[workId.powder].amt += specObj[partId][amtId];
					}				
				}
				
			//покраска дерева
			if(specObj[partId].timberPaint && timberPaint != "нет"){
				if(!workId.painting) logText += "Для детали " + specObj[partId].name + " (" + partId + ") нет workId.painting<br/>";
				else{

					var amtId = workList.painting[workId.painting].amtId;
					var paintWorkId = workId.painting;
					if(timberPaint == "морилка+лак" || timberPaint == "морилка+масло" || timberPaint == "цветное масло") paintWorkId += "_col";
					workList.painting[paintWorkId].amt += specObj[partId][amtId];
					}				
				}
			
			}
		}

$("#works_log").append(logText)


} //end of calcWorks

/** функция выводит на страницу расчет трудоемкости производства
работает с глобальным объектом workList
par={
	workList
	noPrint: true,
}
*/

function printWorks2(par){
	
	var list = workList;
	if(!par) par = {};
	if(par.workList) list = par.workList;
	
	//очищаем блоки на странице
	
	for(var dept in list){
		par[list[dept].outputDivId] = "";
		if(!par.noPrint) $("#" + list[dept].outputDivId).html("");		
	}
	
	
	
	var tableHeader = "<table class='tab_2'><tbody><tr><th>Наименование</th><th>Ед.изм.</th><th>Кол-во</th><th>Подготовка, мин</th><th>мин/ед</th><th>Трудозатраты, н-ч</th></tr>";
	var tableFooter = "</tbody></table>"
	
	//цикл перебора цехов	
	for(var dept in list){
		var tempText = "<h3>" + list[dept].deptName + "</h3>";
		tempText += tableHeader;
	
		//цикл перебора работ участка
		for(var work in list[dept]){
			
			if(list[dept][work]["amt"]){

				var workTime = list[dept][work]["startTime"] + list[dept][work]["unitTime"] * list[dept][work]["amt"];
				//переводим в часы
				workTime = Math.round(workTime / 60 * 10) / 10;
				if(!par.noPrint) list[dept].totalTime += workTime; //при печати из таблицы заказов эти данные уже есть в базе
				
				tempText += "<tr>" + 
					"<td>" + list[dept][work]["name"] + "</td>" + 
					"<td>" + list[dept][work]["amtName"] + "</td>" + 
					"<td>" + Math.round(list[dept][work]["amt"]*10)/10 + "</td>" + 
					"<td>" + list[dept][work]["startTime"] + "</td>" +
					"<td>" + list[dept][work]["unitTime"] + "</td>" +
					"<td>" + workTime + "</td>" +
					"</tr>";
				}
			}//конец перебора работ участка
	
		tempText += tableFooter;
		list[dept].totalTime = Math.round(list[dept].totalTime * 10) / 10;
		tempText += "<b>Итого по цеху: " + list[dept].totalTime + " нормо-часов</b><br/>";
		

		//выводим на страницу информацию по цеху
		par[list[dept].outputDivId] += tempText;
		if(!par.noPrint) $("#" + list[dept].outputDivId).append(tempText);
		
		}//конец перебора цехов
		
	//костыль чтобы не было критической ошибки
	if(!list.plasma) list.plasma = {};
	if(!list.metal) list.metal = {};
	if(!list.powder) list.powder = {};
	if(!list.timber) list.timber = {};
	if(!list.cnc) list.cnc = {};
	if(!list.painting) list.painting = {};
		
	//сводная таблица
	var text = "<h4>Трудоемкость по участкам:</h4>";
	text += "<table class='tab_2'><tbody><tr><th>плазма</th><th>металл</th><th>порошок</th><th>столярка</th><th>ЧПУ</th><th>малярка</th></tr>";
	text += "<tr><td>" + list["plasma"].totalTime + "</td><td>" + list["metal"].totalTime + 
		"</td><td>" + list["powder"].totalTime + "</td><td>" + list["timber"].totalTime + 
		"</td><td>" + list["cnc"].totalTime + "</td><td>" + list["painting"].totalTime + "</td></tr>";
	
	text += "</tbody></table>";
	
	if(!par["works_all"]) par["works_all"] = "";
	par["works_all"] += text;
	

	//страница КП
	if(!par.noPrint && window.getExportData_com ) {
		//общее время изготовления

		var data = getExportData_com(false).production_data;
		text += printProductionTime(data)
		$("#works_all").html(text);
	}
	
	//сдельная зарплата для маляра
	
	par["works_timberPaint"] += printTimberPaintWage(list);
	if(!par.noPrint) $("#works_timberPaint").html(printTimberPaintWage(list));
	//text += printTimberPaintWage();
	
	//сдельная зарплата монтаж
	if(!par.noPrint && params.isAssembling == "есть"){
		par["works_install"] += calcAssemblingWage().text;
		if(!par.noPrint) $("#works_install").html(calcAssemblingWage().text);		
		}
	
	return par;

}//end of printWorks2

/** функция распечатывает общее время производства (опережение запуска)
*/
function printProductionTime(data){

	var text = "<h4>Общее время изготовления:</h4><div>"
	var mainDepts = ["metal", "timber", "painting"];
	var noData = true;
		
	$.each(mainDepts, function(){
		var dept = this;
		//формируем подробное описание расчета времени изготовления
		if(data[dept].planningTimes){
			var deptFullDescr = "";
			var deptTotalTime = 0;
			$.each(data[dept].planningTimes, function(){
				deptTotalTime += this.val * 1.0;
				deptFullDescr += "-" + this.descr + ": " + this.val + " раб. дн.<br/>";
			});
			
			if(deptTotalTime){
				text += "<div class='deptTime'>" + data[dept].deptName + ": " + deptTotalTime + " раб.дн.<br/>" + 
					"<div class='deptTimeInfo'>" + deptFullDescr + "</div>" + 
					"</div>";
			}
			noData = false;
		}
	})
	if(noData) text += "нет данных";
	text += "</div>";
	
	return text;
}

/** функция расчитывает сдельную зарплату для маляра
*/

function printTimberPaintWage(list){
	if(!list) list = workList; //используем глобальную переменную
	
	var text = "<h3>Объем покраски и премия маляра</h3>" +
		"<table class='tab_2'><tbody><tr>" +
			"<th>Наименование</th>" +
			"<th>Ед.изм.</th>" +
			"<th>Кол-во</th>" +
			"<th>Расценка</th>" +
			"<th>н-м/ед.</th>" +
			"<th>Итого</th>" +			
			"<th>Объем, н-м</th>" +			
			"</tr>";
	var tableFooter = "</tbody></table>"

	
	var dept = "painting";
	var standartUnitsTotal = 0;
	list[dept].totalWage = 0;
	
	//цикл перебора работ цеха
	for(var work in list[dept]){
		
		if(list[dept][work]["amt"]){

			var workWage = Math.round(list[dept][work]["unitWage"] * Math.round(list[dept][work]["amt"]*10)/10)
			list[dept].totalWage += workWage;
			var standartUnitsSum = Math.round(list[dept][work]["standartUnits"] * Math.round(list[dept][work]["amt"]*10)/10 * 10) / 10
			
			text += "<tr>" + 
				"<td class='left'>" + list[dept][work]["name"] + "</td>" + 
				"<td>" + list[dept][work]["amtName"] + "</td>" + 
				"<td>" + Math.round(list[dept][work]["amt"]*10)/10 + "</td>" + 
				"<td>" + list[dept][work]["unitWage"] + "</td>" +
				"<td>" + list[dept][work]["standartUnits"] + "</td>" +	
				"<td>" + workWage + "</td>" +							
				"<td>" + standartUnitsSum + "</td>" +
				"</tr>";
				
				/*
			//объем в н-м
			text2 += "<tr>" + 
				"<td class='left'>" + list[dept][work]["name"] + "</td>" + 
				"<td>" + list[dept][work]["amtName"] + "</td>" + 
				"<td>" + Math.round(list[dept][work]["amt"]*10)/10 + "</td>" + 
				"<td>" + list[dept][work]["standartUnits"] + "</td>" +
				"<td>" + standartUnitsSum + "</td>" +
				"</tr>";
				*/
			standartUnitsTotal += standartUnitsSum;
			
		}
	}//конец перебора расценок цеха
	
	standartUnitsTotal = Math.round(standartUnitsTotal * 10) / 10;
	
	//расчет объема в нормо-метрах по слоям покрытия
	var paintLayers = {
		color: {name: "Морилка"},
		patina: {name: "Патина"},
		base: {name: "Грунт"},
		finish: {name: "Финиш"},
	};
	$.each(paintLayers, function(){
		this.amt = 0;
	})
	if(typeof params != "undefined" && params.calcType != 'fire_2' && params.calcType != 'carport'){
		if(params.timberPaint.indexOf("масло") != -1){
			paintLayers.base.name += " (масло)";
			paintLayers.finish.name += " (масло)";
		}
		//морилка
		if(params.timberPaint.indexOf("морилка") != -1){
			paintLayers.color.amt = Math.round(standartUnitsTotal * 0.2 * 10) / 10;
		}
		
		//патина
		if(params.timberPaint.indexOf("патина") != -1){
			paintLayers.patina.amt = Math.round(standartUnitsTotal * 0.2 * 10) / 10;
		}
	}

	paintLayers.base.amt = Math.round((standartUnitsTotal - paintLayers.color.amt - paintLayers.patina.amt) * 0.4 * 10) / 10;
	paintLayers.finish.amt = Math.round((standartUnitsTotal - paintLayers.color.amt - paintLayers.patina.amt - paintLayers.base.amt) * 10) / 10;
	
	if(typeof params != "undefined" && params.timberPaint && params.timberPaint.indexOf("масло") != -1){
		paintLayers.base.amt = Math.round(standartUnitsTotal / 2 * 10) / 10;
		paintLayers.finish.amt = paintLayers.base.amt;
	}
	
	
	
	text += tableFooter;
	list[dept].totalWage = Math.round(list[dept].totalWage * 10) / 10;
	text += "<b>Итого премия по заказу: " + list[dept].totalWage + " руб.</b><br/>" +
		"<b>Общий объем: " + standartUnitsTotal + " нормо-метров<br/>В том числе:</b><br/>";

	$.each(paintLayers, function(){
		if(this.amt) text += this.name + ": " + this.amt + " н-м<br/>"
	})
	
	if(!list[dept].totalWage) text = "";

	return text;

}//end of printTimberPaintWage


/** функция рассчитывает сдельную зарплату монтажников
*/

function calcAssemblingWage(){

	if(params.isAssembling == "нет"){
		var result = {
			totalWage: 0,
			text: "",
			}		
		return result;
		}

	var wages = {
		carcas: {
			name: "Каркас",
			},
		treads: {
			name: "Ступени",
			},
		railing: {
			name: "Ограждения",
			},
		objects: {
			name: "Объекты",
			},
		other: {
			name: "Прочее",
			},
		};
	for(var dept in wages){
		wages[dept].items = [];
		}
		
	var extraWages = []; //надбавки
	var calcAll = false; //параметр для отладки - посчитаются все расценки

	
	

if(params.calcType != "vint" && params.calcType != "objects"){

	var stepAmt = calcTotalStepAmt();
	
	//каркас, ступени
	
	var wage = {
		name: "Монтаж базовый",
		amt: stepAmt,
		unitName: "подъем",
		unitWage: 350,
		}	
	wages.carcas.items.push(wage);
	
	var wage = {
		name: "Монтаж базовый",
		amt: stepAmt,
		unitName: "подъем",
		unitWage: 100,
		}
	wages.treads.items.push(wage);
	
	if(params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом" || calcAll) {
		var wage = {
			name: "Г-образная лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 1000,
			}
		wages.carcas.items.push(wage);
		var wage = {
			name: "Г-образная лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 500,
			}
		wages.treads.items.push(wage);
		}
	if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом" || calcAll) {
		var wage = {
			name: "П-образная лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 2000,
			}
		wages.carcas.items.push(wage);
		var wage = {
			name: "П-образная лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 1000,
			}
		wages.treads.items.push(wage);
		}
	if(params.stairModel == "П-образная трехмаршевая" || calcAll) {
		var wage = {
			name: "Трехмаршевая лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 5000,
			}
		wages.carcas.items.push(wage);
		var wage = {
			name: "Трехмаршевая лестница",
			amt: 1,
			unitName: "этаж",
			unitWage: 1000,
			}
		wages.treads.items.push(wage);
		}
		
	if(params.stairModel == "Прямая с промежуточной площадкой" || calcAll) {
		var wage = {
			name: "Прямая с промежуточной площадкой",
			amt: 1,
			unitName: "этаж",
			unitWage: 1000,
			}
		wages.carcas.items.push(wage);
		var wage = {
			name: "Прямая с промежуточной площадкой",
			amt: 1,
			unitName: "этаж",
			unitWage: 500,
			}
		wages.treads.items.push(wage);
		}
	if((params.platformTop && params.platformTop != "нет") || calcAll) {
		var wage = {
			name: "Верхняя площадка",
			amt: 1,
			unitName: "шт",
			unitWage: 1000,
			}
		wages.carcas.items.push(wage);
		var wage = {
			name: "Верхняя площадка",
			amt: 1,
			unitName: "шт",
			unitWage: 500,
			}
		wages.treads.items.push(wage);
	}
	if(params.M > 1100 || calcAll) {
		var wage = {
			name: "третий косоур",
			amt: 1,
			unitName: "этаж",
			unitWage: 2000,
			}
		wages.carcas.items.push(wage);
	}

//обшивка бетонных лестниц
if(params.calcType == "railing" && params.stairType != "нет" && params.isAssembling != "нет"){
	wages.treads.items = [];
	var costFactor = 1.5; //наценка 14.10.20
	
	//фанера
	if(params.plywoodThk){
		var wage = {
			name: "Обшивка ступеней фанерой с выравниванием",
			amt: stepAmt,
			unitName: "подъем",
			unitWage: 800 * costFactor,
			}
		wages.treads.items.push(wage);
		
		var wage = {
			name: "Обшивка площадок фанерой с выравниванием",
			amt: getPartPropVal("platformTread", "area"),
			unitName: "м2",
			unitWage: 1000 * costFactor,
			}
		wages.treads.items.push(wage);
	}
	
	//шаблонирование
	if(params.needMockup == "да"){
		var wage = {
			name: "Шаблонирование ступеней (рейки)",
			amt: stepAmt,
			unitName: "шт",
			unitWage: 200 * costFactor,
		}
		wages.treads.items.push(wage);
	}

	//укладка
	var wage = {
		name: "Установка ступеней",
		amt: stepAmt,
		unitName: "подъем",
		unitWage: 400 * costFactor,
		}
	wages.treads.items.push(wage);
	
	var wage = {
		name: "Установка площадок",
		amt: getPartPropVal("platformTread", "area"),
		unitName: "м2",
		unitWage: 800 * costFactor,
		}
	wages.treads.items.push(wage);
}
		
	var wage = {
		name: "Плинтус",
		amt: getPartAmt("skirting_hor"),
		unitName: "подъем",
		unitWage: 120,
		}
	if(wage.amt == 0 && calcAll) wage.amt = 1;
	wages.treads.items.push(wage);
	
	var wage = {
		name: "Подгонка ступеней к стене",
		amt: 0,
		unitName: "подъем",
		unitWage: 200,
	}
	if(params.stepCutting == "да") wage.amt = stepAmt;
	if(wage.amt == 0 && calcAll) wage.amt = 1;
	wages.treads.items.push(wage);
	
	var wage = {
		name: "Установка подступенков",
		amt: 0,
		unitName: "подъем",
		unitWage: 100,
		}
	if(params.riserType == "есть") wage.amt = stepAmt;
	if(wage.amt == 0 && calcAll) wage.amt = stepAmt;
	wages.treads.items.push(wage);
	
	
//очищаем массивы если нет каркаса или ступеней
	if(params.stairType == "нет") wages.treads.items = [];
	if(params.isCarcas == "нет" || params.calcType == "railing") wages.carcas.items = [];
	
// к-ты за сложность


	var wage = {
		name: "Детали крашеные",
		carcas: 0,
		treads: 0,
		}
		
	if(params.metalPaint != "нет" || calcAll) wage.carcas = 15;
	if(params.timberPaint != "нет" || calcAll) wage.treads = 15;
	if(params.calcType != "railing" && params.calcType != "carport" && params.calcType != "veranda")
	extraWages.push(wage);
	
	var wage = {
		name: "Стеклянные ступени",
		carcas: 0,
		treads: 0,
		}
	if(params.stairType == "стекло" || calcAll) wage.treads = 100;
	extraWages.push(wage);
	
	var wage = {
		name: "Монокосоур",
		carcas: 0,
		treads: 0,
		}
	if(params.calcType == "mono" || calcAll) {
		wage.carcas = 20;
		wage.treads = 20;
		}
	extraWages.push(wage);
	
	var wage = {
		name: "Деревянная",
		carcas: 0,
		treads: 0,
		}
	if(params.calcType == "timber" || calcAll) {
		wage.carcas = 20;
		wage.treads = 20;
		}
	extraWages.push(wage);
	
} //конец маршевой

if(params.calcType == "vint"){
	//каркас, ступени
	
	var wage = {
		name: "Монтаж лестницы",
		amt: params.stepAmt,
		unitName: "подъем",
		unitWage: 600,
		}	
	wages.carcas.items.push(wage);
	
	var wage = {
		name: "Внешняя тетива",
		carcas: 0,
		treads: 0,
		}
	if(params.model == "Винтовая с тетивой" || calcAll) wage.carcas = 20;
	extraWages.push(wage);
	
	}
	
if(params.calcType == "carport"){
	
	//каркас	
	var wage = {
		name: "Сборка каркаса навеса",
		amt: params.sectAmt * params.sectLen * params.width / 1000000,
		unitName: "м2",
		unitWage: 400,
		}	
	wages.carcas.items.push(wage);
	
	//кровля
	var wage = {
		name: "Укладка кровли",
		amt: params.sectAmt * params.sectLen * params.width / 1000000,
		unitName: "м2",
		unitWage: 100,
		}	
	wages.carcas.items.push(wage);
	
	//опоры столбов
	if(params.fixType == "бетон"){
		var wage = {
			name: "Бетонирование столбов",
			amt: getPartAmt("carportColumn"),
			unitName: "шт",
			unitWage: 500,
			}	
		wages.carcas.items.push(wage);
	}
	
	if(params.fixType == "винтовые сваи"){
		var wage = {
			name: "Установка винтовых свай",
			amt: getPartAmt("carportColumn"),
			unitName: "шт",
			unitWage: 500,
			}	
		wages.carcas.items.push(wage);
	}
	
}

if(params.calcType == "railing"){

	var railingTypes = [];
	$("#railingType0 option").each(function(){
		var railingType = {
			name: this.value,
			meterCost: 700,
			amt: 0,
			};
		if(railingType.name == "Cтекло на стойках") railingType.meterCost = 1000;
		if(railingType.name == "стекло рут." || railingType.name == "стекло проф.") railingType.meterCost = 2000;
		if(railingType.name == "поручень") railingType.meterCost = 500;
		if(railingType.name == "Деревянные балясины" || 
			railingType.name == "Модерн" ||
			railingType.name == "Дерево с ковкой"
			) railingType.meterCost = 1000;
		
		railingTypes.push(railingType);
	});
	
	
	
	$(".railingType").each(function(){
		var len_hor = $(this).closest("tr").find(".len").val();
		var ang = $(this).closest("tr").find(".angle").val() / 180 * Math.PI;
		var len = len_hor / Math.cos(ang);
		var type = getArrItemByProp(railingTypes, 'name', $(this).val());
		type.amt += Math.round(len / 1000 * 10) / 10;
		})
		
	$.each(railingTypes, function(){
		if(this.amt){
			var wage = {
				name: "Монтаж ограждений " + this.name,
				amt: Math.round(this.amt * 10) / 10,
				unitName: "м.п.",
				unitWage: this.meterCost,
				}	
			wages.railing.items.push(wage);
			}
		})
	
	}


//подоконники

	var wage = {
		name: "Монтаж подоконников/столешниц",
		amt: Math.round(getDopPartPropVal("sill", "area") * 10) / 10,
		unitName: "м2",
		unitWage: 2000,
		}	
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Подготовка основания",
		amt: getDopPartPropVal("sill", "amt"),
		unitName: "шт",
		unitWage: 500,
		}	
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Подгонка изделий по месту",
		amt: getDopPartPropVal("sill", "amt") - getDopPartPropVal("sill", "lineTemplatesAmt") - getDopPartPropVal("sill", "curveTemplates"),
		unitName: "шт",
		unitWage: 500,
		}	
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Шаблоны прямолинейные",
		amt: getDopPartPropVal("sill", "lineTemplatesAmt"),
		unitName: "шт",
		unitWage: 1000,
		minWage: 2000,
		}
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Шаблоны криволинейные",
		amt: getDopPartPropVal("sill", "curveTemplates"),
		unitName: "шт",
		unitWage: 2000,		
	}
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Установка опор",
		amt: 0,
		unitName: "шт",
		unitWage: 1000,
		}
	wages.objects.items.push(wage);
	
	var wage = {
		name: "Демонтаж",
		amt: getDopPartPropVal("sill", "breaking"),
		unitName: "шт",
		unitWage: 1000,
		}	
	wages.objects.items.push(wage);
	
//ограждения
	
	//ограждение лестницы
	
	var wage = {
		name: "Монтаж ограждений лестницы (" + params.railingModel + ")",
		amt: 0,
		unitName: "м.п.",
		unitWage: 350,
		total: 0,
		}
	if(params.railingModel == "Стекло на стойках") wage.unitWage = 500;
	if(params.railingModel == "Самонесущее стекло") wage.unitWage = 1000;
	if(params.railingModel == "Кованые балясины") wage.unitWage = 350;
	if(params.railingModel == "Деревянные балясины") wage.unitWage = 500;
	if(params.railingModel == "Стекло") wage.unitWage = 500;
	if(params.railingModel == "Дерево с ковкой") wage.unitWage = 500;
	
	
	//расчет длины	
	if(typeof railingParams != "undefined" && railingParams.sections) wage.amt = Math.round(railingParams.sections.sumLen * 10) / 10;
	if(params.calcType == "timber" || 
		params.railingModel == "Деревянные балясины" ||
		params.railingModel == "Стекло" ||
		params.railingModel == "Дерево с ковкой"){
			wage.amt = Math.round(getPartPropVal("handrails", "sumLength") * 10) / 10;
		} 
	if(wage.amt == 0 && calcAll) wage.amt = 1;	
	if(wage.amt > 0) wages.railing.items.push(wage);
	
	//пристенный поручень
	
	var wage = {
		name: "Монтаж пристенных поручней",
		amt: 0,
		unitName: "м.п.",
		unitWage: 500,
		total: 0,
		}
	
	//расчет длины
	
	
	wage.amt = Math.round(getPartPropVal("sideHandrails", "sumLength", partsAmt) * 10) / 10;	
	if(wage.amt == 0 && calcAll) wage.amt = 1;	
	if(wage.amt > 0) wages.railing.items.push(wage);
	
	
	//ограждение балюстрады
	
	var wage = {
		name: "Монтаж балюстрады (" + params.railingModel_bal + ")",
		amt: calcBanisterLen(), //функция в этом файле
		unitName: "м.п.",
		unitWage: 700,
		total: 0,
		}
	if(params.railingModel_bal == "Стекло на стойках") wage.unitWage = 1000;
	if(params.railingModel_bal == "Самонесущее стекло") wage.unitWage = 2000;
	if(params.railingModel_bal == "Кованые балясины") wage.unitWage = 700;
	if(params.railingModel_bal == "Деревянные балясины" || 
			params.railingModel_bal == "Модерн" ||
			params.railingModel_bal == "Дерево с ковкой" ||
			params.railingModel_bal == "Стекло"
			) wage.unitWage = 1000;
	
	if(wage.amt == 0 && calcAll) wage.amt = 1;	
	if(wage.amt > 0 && params.railingModel_bal != "нет") wages.railing.items.push(wage);
	

	
	//запилка поручней по месту
	var wage = {
		name: "Запил стыков поручней по месту",
		amt: params.handrailCutting,
		unitName: "стык",
		unitWage: 500,
		total: 0,
		}
	if(wage.amt == 0 && calcAll) wage.amt = 1;
	if(wage.amt > 0) wages.railing.items.push(wage);
	
	

//транспортные расходы
	
	var wage = {
		name: "Выезд до 40км от МКАД",
		amt: params.workers,
		unitName: "шт",
		unitWage: 500,
		total: 0,
		}
		
	if(params.deliveryDist > 40){
		wage.name = "Выезд до 100км от МКАД";
		wage.unitWage = 1000;
		}
	if(params.deliveryDist > 100){
		wage.name = "Выезд до 200км от МКАД";
		wage.unitWage = 2000;
		}

	if(wage.amt > 0) wages.other.items.push(wage);
	
	var wage = {
		name: "Доставка заказа из цеха на объект",
		amt: 0,
		unitName: "шт",
		unitWage: 2000,
		total: 0,
		}
		
	if(params.deliveryByInstallers == "да" || calcAll) wage.amt = 1;
	if(wage.amt > 0) wages.other.items.push(wage);
	
	var wage = {
		name: "Повторный выезд из-за косяков",
		amt: params.extraTripAmt,
		unitName: "шт",
		unitWage: 4000,
		total: 0,
		}
		
	if(wage.amt == 0 && calcAll) wage.amt = 1;
	if(wage.amt > 0) wages.other.items.push(wage);
	
	var wage = {
		name: "Подъем без лифта более 3 этажей",
		amt: 0,
		unitName: "шт",
		unitWage: 1000,
		total: 0,
		}
		
	if(params.noLiftCare == "да" || calcAll) wage.amt = 1;
	if(wage.amt > 0) wages.other.items.push(wage);
	
	var wage = {
		name: "Платная парковка рядом с объектом",
		amt: 0,
		unitName: "шт",
		unitWage: 1500,
		total: 0,
		}
		
	if(params.paidParking == "да" || calcAll) wage.amt = 1;
	if(wage.amt > 0) wages.other.items.push(wage);
	
	
	var totalWage = 0;
	var sum = {};

//текст для вывода на страницу
	
	var tableHeader = "<table class='tab_2'><tbody><tr><th>Наименование</th><th>Ед.изм.</th><th>Кол-во</th><th>Расценка</th><th>Итого</th></tr>";
	var tableFooter = "</tbody></table>"

	var text = "<h3>Cдельная зарплата монтажников</h3>";
	
	for(var dept in wages){
		var deptWages = wages[dept].items;

		if(deptWages.length == 0) continue;
		console.log(dept, deptWages.length, deptWages)
		
		sum[dept] = {
			base: 0,
			extra: 0,
			};
		
		text += "<h4>" + wages[dept].name + "</h4>" + tableHeader;
		
		for(var i=0; i<deptWages.length; i++){
			//общая сумма
			deptWages[i].total = deptWages[i].amt * deptWages[i].unitWage;
			
			//минималка по позиции
			var isMinWage = false;
			if(deptWages[i].total > 0 && deptWages[i].total < deptWages[i].minWage) {
				deptWages[i].total = deptWages[i].minWage;
				isMinWage = true;
			}
			if(deptWages[i].total > 0 || calcAll){
				text += "<tr><td>" + deptWages[i].name + "</td>" + 
					"<td>" + deptWages[i].unitName + "</td>" + 
					"<td>" + deptWages[i].amt + "</td>" + 
					"<td>" + deptWages[i].unitWage + "</td>" + 
					"<td>" + Math.round(deptWages[i].total);
				if(isMinWage) text += " (мин)";
				text += "</td></tr>";
				sum[dept].base += deptWages[i].total;
				}
			}
		
		text += tableFooter;
		text += "Итого: " + sum[dept].base + "<br/>";
		
		//надбавки за сложность
		if(dept == "carcas" || dept == "treads"){
			var extraText = "Надбавки за сложность: <br/>";
		
			for(var i=0; i<extraWages.length; i++){
				if(extraWages[i][dept] != 0 || calcAll){
					extraText += extraWages[i].name + ": +" + extraWages[i][dept] + "%<br/>";
					sum[dept].extra += (extraWages[i][dept] / 100) * sum[dept].base;
					}
				}
			extraText += "<b>Итого с надбавками: " + (Math.round(sum[dept].base + sum[dept].extra)) + "</b><br/>";
			}
		totalWage += (Math.round(sum[dept].base + sum[dept].extra));
		if(sum[dept].extra) text += extraText;
		}
		
	//минималка
	var isMinWage = false;
	var minWage = {
		base: 4000,
		total: 0,
		other: 0,
		};	
	
	//базовая
	if(calcTotalStepAmt() > 7) minWage.base = 7000;
	if(params.calcType == "railing") minWage.base = 7000;
	if(params.calcType == "objects") {
		minWage.base = 4500;
		if(params.needMockup == "да") minWage.base = 6500;
	}
	minWage.total += minWage.base;
	
	//многоэтапные заказы
	minWage.total += (params.workers - 1) * 4000;
	
	//прочие расходы (транспорт, парковка, доставка и т.п.)
	minWage.other = 0;
	for(var i=0; i< wages.other.items.length; i++){
		minWage.other += wages.other.items[i].total;
		}
	minWage.total += minWage.other;
	
	text += "<h4 class='bold'>Итого по расценкам: " + totalWage + "</h4>";
		
	text += "<h4>Расчет минималки</h4>" + 
		"Первый этап: " + minWage.base;

	if(params.calcType != "railing" && params.calcType != "objects"){
		if(calcTotalStepAmt() > 7) text += " (лестница более 7 ступеней)";
		else text += " (лестница менее 7 ступеней)";
	}
	
	if(params.calcType == "objects" && params.needMockup == "да"){
		text += " (4500 + 2000)";
	}

	
	text += "<br/>"
	
	text += "Дополнительные этапы: " + (params.workers - 1) * 4000 + "<br/>" + 
		"Прочие расходы: " + minWage.other + "<br/>" + 
		"<b>Итого минималка: " + minWage.total;
	
	
	
	if(totalWage < minWage.total){
		totalWage = minWage.total;
		isMinWage = true;
		}

	
	if(!isMinWage) text += "<h3 class='bold yellow'>Итого по заказу: " + totalWage + "</h3>";
	if(isMinWage) text += "<h3 class='bold yellow'>Итого по заказу: " + totalWage + " (минималка)</h3>";
	
	var result = {
		totalWage: totalWage,
		text: text,
		}
	
	
	return result;
		

}//end of calcAssemblingWage

/** старая функция, добавляющая позиции в workList
используется только на деревянных лестницах
*/

function addTimberWorks(type, itemId, amt, partsList){
	
	var isTimberTreads = false;
	if(params.calcType != "vint"){
		
	if(partsList.rectTread_marsh1.division == "timber" && amt != 0){
	
		if(type == "rect"){

			workList.timber.rect.amt += partsList[itemId].area * amt;
			if(params.timberPaint == "лак"){
				workList.painting.plane.amt += partsList[itemId].paintedArea * amt;
				}
			if(params.timberPaint == "морилка+лак"){
				workList.painting.plane_col.amt += partsList[itemId].paintedArea * amt;
				}
			}
		if(type == "winder"){
			workList.timber.winder.amt += amt;
			if(params.timberPaint == "лак"){
				workList.painting.plane.amt += partsList[itemId].paintedArea * amt;
				}
			if(params.timberPaint == "морилка+лак"){
				workList.painting.plane_col.amt += partsList[itemId].paintedArea * amt;
				}
			}
			
		if(type == "stringer_T"){
			workList.timber.stringer_T.amt += amt;
			if(params.timberPaint == "лак"){
				workList.painting.plane.amt += 0.7 * amt;
				}
			if(params.timberPaint == "морилка+лак"){
				workList.painting.plane_col.amt += 0.7 * amt;
				}
			}
		
		if(type == "stringer_K"){
			workList.timber.stringer_K.amt += amt;			
			if(params.timberPaint == "лак"){
				workList.painting.plane.amt += 0.7 * amt;
				}
			if(params.timberPaint == "морилка+лак"){
				workList.painting.plane_col.amt += 0.7 * amt;
				}
			}
		
		
			
		}
	}
		
		
		if(type == "handrail"){
			workList.timber.handrail.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.handrail.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.handrail_col.amt += amt;
				}
			}
			
		if(type == "slotHandrail"){
			workList.timber.slotHandrail.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.handrail.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.handrail_col.amt += amt;
				}
			}
		
		if(type == "handrailOmega"){
			workList.timber.handrailOmega.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.handrailOmega.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.handrailOmega_col.amt += amt;
				}
			}
			
		if(type == "combBanister"){
			workList.timber.combBanister.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.combBanister.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.combBanister_col.amt += amt;
				}
			}
			
		if(type == "latheBanister"){
			workList.timber.latheBanister.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.banister.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.banister_col.amt += amt;
				}
			}
			
		if(type == "latheNewell"){
			workList.timber.latheNewell.amt += amt;			
			if(params.timberPaint_perila == "лак"){
				workList.painting.latheNewell.amt += amt;
				}
			if(params.timberPaint_perila == "морилка+лак"){
				workList.painting.latheNewell_col.amt += amt;
				}
			}
			
}//end of addTimberWorks

/** функция возвращает общее количество подъемов в лестнице
*/
function calcTotalStepAmt(){

	var stepAmt = params.stairAmt1;
	if(params.stairModel != "Прямая") stepAmt += params.stairAmt3;
	if(params.stairModel == "П-образная трехмаршевая") stepAmt += params.stairAmt2;
	//учитываем подъемы на поворотах
	if(params.stairModel == "Г-образная с площадкой" || params.stairModel == "П-образная с площадкой") stepAmt += 1;
	if(params.stairModel == "Г-образная с забегом") stepAmt += 3;
	if(params.stairModel == "П-образная с забегом") stepAmt += 6;
	if(params.stairModel == "П-образная трехмаршевая") {
		if(params.turnType_1 == "площадка") stepAmt += 1;
		if(params.turnType_1 == "забег") stepAmt += 3;
		if(params.turnType_2 == "площадка") stepAmt += 1;
		if(params.turnType_2 == "забег") stepAmt += 3;
	}
	
	if(params.calcType == "railing"){
		stepAmt = getPartAmt("tread") + getPartAmt("timberTurnTread")
	}

	return stepAmt;
} //end of calcTotalStepAmt

function calcBanisterLen(){
	var len = 0;
	
	//перебираем все строки таблицы параметров секций
	var banisterSectionTypes = $('.balSectRow [id^=banisterSectionType]');
	
	$.each(banisterSectionTypes, function(i){
		var banisterSectionType = $('#banisterSectionType' + i).val();
		var banisterSectionLength = $('#banisterSectionLength' + i).val() / 1000;
		if(banisterSectionType == "секция") len += Math.round(banisterSectionLength * 10) / 10;
		});
	
	return Math.round(len * 10) / 10;

}
