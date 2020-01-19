function drawOrnaments(){
	getAllInputsValues(params);
	var path = "/images/carving/"
	
//формируем имена картинок
	
	//контур
	var base = path + "/base/" + params.stringerType + "_base.png";
	var riserBase = path + "/base/" + params.stringerType + "_riser_base.png";
	
	//превьюшки вариантов узоров
	var topPrv = path + params.topOrnamentSeries + "/" + params.stringerType + "_top_prv.jpg";
	var botPrv = path + params.topOrnamentSeries + "/" + "bot_prv.jpg";
	//var risersPrv = path + params.riserOrnamentSeries + "/" + "risers_prv.jpg";
	
	//верхний узор
	var top = path + "/" + params.topOrnamentSeries + "/" + params.stringerType + "_top_" + params.topOrnamentNumber + ".png";
	if (params.topOrnamentSeries == "no") top = false;

	//нижний узор
	var bot = path + "/" + params.botOrnamentSeries + "/" + "bot_" + params.botOrnamentNumber + ".png";
	if (params.botOrnamentSeries == "no") bot = false;

	//подступенок
	var riser = path + "risers/" + params.riserOrnamentSeries + "/" + params.riserOrnamentNumber + "/prv.png";
	//var riserDxf = path + params.riserOrnamentSeries + "/" + "riser_" + params.riserOrnamentNumber + ".dxf";
	if (params.riserOrnamentSeries == "no") riser = false;

//заменяем картинки на странице
	
	//основа
	$("#baseImg").attr("src", base);
	$("#baseRiserImg").attr("src", riserBase);

	//верхний узор
	$("#topImg").hide();
	if(top) {
		$("#topImg").attr("src", top);
		$("#topImg").show();
		}

	//нижний узор
	$("#botImg").hide();
	if(bot) {
		$("#botImg").attr("src", bot);
		$("#botImg").show();
		}
		
	//подступенки
	$("#riserImg_1").hide();
	$("#riserImg_2").hide();
	$("#riserImg_3").hide();
	$("#riserImg_4").hide();
	$("#riserImg_5").hide();
	$("#riserImg_6").hide();
	if(riser) {
		$("#riserImg_1").attr("src", riser);
		$("#riserImg_2").attr("src", riser);
		$("#riserImg_3").attr("src", riser);
		$("#riserImg_4").attr("src", riser);
		$("#riserImg_5").attr("src", riser);
		$("#riserImg_6").attr("src", riser);
		$("#riserImg_1").show();
		$("#riserImg_2").show();
		$("#riserImg_3").show();
		$("#riserImg_4").show();
		$("#riserImg_5").show();
		$("#riserImg_6").show(); 
		}
	
	//эскизы вариантов узоров
	$("#topPrv").attr("src", topPrv);
	$("#botPrv").attr("src", botPrv);
	//$("#risersPrv").attr("src", risersPrv);
	
	//контура в dxf
	//$("#riserDxf").attr("href", riserDxf);
	
	
	
//узоры на подступенках

$("#riserImg_1").hide();
$("#riserImg_3").hide();
$("#riserImg_5").hide();


if(params.riserOrnamentPos != "через один" && riser){
	console.log(params.riserOrnamentPos)
	$("#riserImg_1").show();
	$("#riserImg_3").show();
	$("#riserImg_5").show();

	}
	
} //end of drawOrnaments