$(function () {

	$("#templateStaircase").change(function(){
		var templateName = $(this).val();
		var templateDefault = {}
		if(templateName == "Эконом"){
			templateDefault = {
				templateTimber: "сосна кл.Б",
				templateMetalPaint: "нет",
				templateTimberPaint: "нет",
			}
		}
		if(templateName == "Стандарт"){
			templateDefault = {
				templateTimber: "лиственница паркет.",
				templateMetalPaint: "порошок",
				templateTimberPaint: "лак",
			}
		}
		if(templateName == "Премиум"){
			templateDefault = {
				templateTimber: "дуб паркет.",
				templateMetalPaint: "порошок",
				templateTimberPaint: "морилка+лак",
			}
		}
		
		for(var prop in templateDefault){
			$("#" + prop).val(templateDefault[prop]);
		}
	})
	
	$("#applyTemplate").click(function(){
		$(".setByTemplate").removeClass('setByTemplate');
		
		//порода дерева
		var timber = $("#templateTimber").val();
		if(timber != "не указано"){
			$('[data-mat="timber"]').each(function(){
				$(this).find(".Material").val(timber);
				$(this).find(".Material").closest("td").addClass('setByTemplate');
				console.log($(this).prop("id"))
			})
		}
		
		//покраска дерева
		if($("#templateTimberPaint").val() != "не указано"){
			$("#timberPaint").val($("#templateTimberPaint").val());
			$("#timberPaint").closest("td").addClass('setByTemplate');
		}
		
		//покраска металла
		if($("#templateMetalPaint").val() != "не указано"){
			$("#metalPaint").val($("#templateMetalPaint").val());
			$("#metalPaint").closest("td").addClass('setByTemplate');
			
			$("#metalPaint_railing").val($("#templateMetalPaint").val());
			$("#metalPaint_railing").closest("td").addClass('setByTemplate');
		}
		
		//параметры ограждений
		var railingPar = {
			railingModel: $("#templateRailingModel").val(),
			templateRailing: $("#templateRailing").val(),
		}
		railingPar = getRailingTemplate(railingPar);
		
		if(railingPar.railingModel != "не указано"){
			for(var prop in railingPar){
				$("#" + prop).val(railingPar[prop]);
				$("#" + prop + "_bal").val(railingPar[prop]);
				$("#" + prop).closest("td").addClass('setByTemplate');
				$("#" + prop + "_bal").closest("td").addClass('setByTemplate');
			}
		}
		
		//сборка
		if($("#templateAssembling").val() != "не указано"){
			$("#isAssembling").val($("#templateAssembling").val());
			$("#isAssembling").closest("td").addClass('setByTemplate');
		}
		recalculate();
		
	})

	
});

/** функция возвращает набор опций по двум параметрам: модели ограждений и шаблону комплектации
railingModel

*/

function getRailingTemplate(par){
	//стойки
	if(par.railingModel == "Ригели" ||
		par.railingModel == "Стекло на стойках" ||
		par.railingModel == "Экраны лазер"
	){
		if(par.templateRailing == "Эконом") {
			par.banisterMaterial = "40х40 черн.";
		}
		if(par.templateRailing == "Стандарт") {
			par.banisterMaterial = "40х40 нерж.";
		}
		if(par.templateRailing == "Премиум") {
			par.banisterMaterial = "40х40 нерж+дуб";
		}
	}
	
	//ригели
	if(par.railingModel == "Ригели"){
		if(par.templateRailing == "Эконом") {
			par.rigelMaterial = "20х20 черн.";
			par.rigelAmt = 2;
		}
		if(par.templateRailing == "Стандарт") {
			par.rigelMaterial = "Ф12 нерж.";
			par.rigelAmt = 3;
		}
		if(par.templateRailing == "Премиум") {
			par.rigelMaterial = "Ф12 нерж.";
			par.rigelAmt = 4;
		}
	}
	
	//стекло
	if(	par.railingModel == "Стекло на стойках" ||
		par.railingModel == "Самонесущее стекло" ||
		par.railingModel == "Стекло"
	){
		if(par.templateRailing == "Эконом") {
			par.glassType = "прозрачное";
		}
		if(par.templateRailing == "Стандарт") {
			par.glassType = "прозрачное";
		}
		if(par.templateRailing == "Премиум") {
			par.glassType = "оптивайт";
		}
	}
	
	//ковка
	if(par.railingModel == "Кованые балясины" ||
		par.railingModel == "Дерево с ковкой"
	){
		if(par.templateRailing == "Эконом") {
			par.banister1 = "20х20";
			par.banister2 = "20х20";
			par.balDist = 200;
		}
		if(par.templateRailing == "Стандарт") {
			par.banister1 = "bal_1";
			par.banister2 = "bal_2";
			par.balDist = 150;
		}
		if(par.templateRailing == "Премиум") {
			par.banister1 = "bal_12";
			par.banister2 = "bal_4";
			par.balDist = 150;
		}
	}
	
	//деревянные столбы
	if(par.railingModel == "Деревянные балясины" ||
		par.railingModel == "Дерево с ковкой" ||
		par.railingModel == "Стекло"
	){
		if(par.templateRailing == "Эконом") {
			par.timberRackModel = "01";
		}
		if(par.templateRailing == "Стандарт") {
			par.timberRackModel = "07";
		}
		if(par.templateRailing == "Премиум") {
			par.timberRackModel = "13";
		}
	}
	
	if(par.railingModel == "Стекло"){
		if(par.templateRailing == "Эконом") {
			par.timberRackModel = "01";
		}
		if(par.templateRailing == "Стандарт") {
			par.timberRackModel = "02";
		}
		if(par.templateRailing == "Премиум") {
			par.timberRackModel = "04";
		}
	}
	
	//деревянные балясины
	if(par.railingModel == "Деревянные балясины"
	){
		if(par.templateRailing == "Эконом") {
			par.timberBalModel = "14";			
		}
		if(par.templateRailing == "Стандарт") {
			par.timberBalModel = "10";
		}
		if(par.templateRailing == "Премиум") {
			par.timberBalModel = "22";
		}
	}
	
	//шаг балясин
	if(par.railingModel == "Деревянные балясины" ||
		par.railingModel == "Дерево с ковкой"
	){
		if(par.templateRailing == "Эконом") {
			par.timberBalStep = "1";
		}
		if(par.templateRailing == "Стандарт") {
			par.timberBalStep = "1.5";
		}
		if(par.templateRailing == "Премиум") {
			par.timberBalStep = "2";
		}
	}
	
	
	
	return par;
}

