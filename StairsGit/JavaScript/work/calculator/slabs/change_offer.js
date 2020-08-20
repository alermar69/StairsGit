function changeOffer() {
	var text = "";
	
	
	var timberTypes = [];
	var edgeModels = [];
	var tableBases = [];
	
	$("#estimate_mat .estimateItem").each(function(){
		var unitType = $(this).find(".unitType").val();
		
		//дерево
		var timberUnitTypes = ['столешница', 'подоконник', 'слэб'];
		if(timberUnitTypes.indexOf(unitType) != -1){
			//порода дерева
			var timberType = $(this).find(".timberType").val();
			var imgLink = setTreadDescr({timberType: timberType}).imgLink;
			if(timberTypes.indexOf(imgLink) == -1) timberTypes.push(imgLink)
		}
	
		//фаска
		
		if(unitType == "столешница" || unitType == "подоконник" || unitType == "изготовление столешницы"){
			var edgeModel = $(this).find(".edgeModel").val();
			var imgLink = getEdgeImg(edgeModel);
			if(imgLink && edgeModels.indexOf(imgLink) == -1) edgeModels.push(imgLink)
		}
	
		//подстолье
		if(unitType == "подстолье"){
			var basePar = {
				model: $(this).find(".baseModel").val(),
				width: $(this).find(".width").val(),
				height: $(this).find(".height").val(),
				tableGeom: $(this).find(".tableGeom").val(),
			}
			var imgLink = getTabeBaseImg(basePar);
			if(imgLink && tableBases.indexOf(imgLink) == -1) tableBases.push(imgLink)
			
		}
	})
	
	//вывод картинок
	var imgArrays = [timberTypes, edgeModels, tableBases];
	
	$.each(imgArrays, function(){
		var arr = this;
		$.each(arr, function(){
			text += "<a href='" + this + "' data-fancybox='gallery'><img src='" + this + "' width='300px'></a>";
		})
	})
	
	
	$("#descr").html(text);
}

function getEdgeImg(type){
	var path = "/drawings/tables/edges/";
	var images = {
		"скругление R3": "r-3",
		"скругление R6": "r-6",
		"скругление R12": "r-12",
		"скругление R25": "r-25",
		"фигурная Ф-1": "f-1",
		"фигурная Ф-2": "f-2",
		"фигурная Ф-3": "f-3",
		"фигурная Ф-4": "f-4",
		"фигурная Ф-5": "f-5",
		"фигурная Ф-6": "f-6",
		"фигурная Ф-7": "f-7",
		"фигурная Ф-8": "f-8",
		"фаска 6х45гр": "b-6x45",
		"фаска 12х45гр": "b-12x45",
	}
	
	if(images[type]) return path + images[type] + ".jpg";
	
	return false;
}

/** Возвращает ссылку на картинку подстолья
	par = {
		width
		height
		tableGeom
	}
*/
function getTabeBaseImg(par){
	var path = "/drawings/tables/";
	
	if(!par.model || par.model == "не указано") return false;
		
	if(par.height >= 690){
		imgName = "dining_sm";
		if(par.width >= 650) imgName = "dining_md";
		if(par.width >= 850) imgName = "dining_lg";
		if(par.tableGeom == "круглый") imgName = "dining_round";
	}
	
	if(par.height < 690){
		imgName = "coffee_md";
		if(par.tableGeom == "круглый") imgName = "coffee_round";
	}
	
	
	if(imgName) return path + par.model + "/" + imgName + ".jpg";
	
	return false;
}