$(function () {
	//добавляем видовые экраны на страницу  
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId


	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible


	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible 


	//добавляем балюстраду
	addBanister('vl_1');


	//добавляем проем
	addTopFloor('vl_1');


	//Добавляем слои в 3Д меню
	addLayer('treads', 'Ступени');
	addLayer('risers', 'Подступенки');
	addLayer('carcas', 'Каркас');
	addLayer('railing', 'Ограждения лестницы');
	//addLayer('topFloor', 'Верхнее перекрытие');
	addLayer('topRailing', 'Балюстрада');

	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js
	
	//задаем начальное положение стен
	$("#wallPositionX_1").val(-5000);
	$("#wallPositionX_2").val(-5000);
	$("#wallPositionX_3").val(1000);
	$("#wallPositionX_4").val(-5000);
	
	//скрываем блоки для отладки
	
	//$('.canvas canvas:eq(1)').toggle()
	//$('.canvas canvas:eq(2)').toggle()
 	$("#mainImages").hide();
	//$("#description").hide();
	//$("#complect").hide();
	//$("#totalResult").hide();
	//$("#about").hide(); 

	//пересчитываем лестницу
	recalculate();
		
	function redrawScene(){
		drawTopFloor();
		redrawWalls();
		drawBanister();	
		}
	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', redrawScene);
	

	
	//скрываем ненужные блоки
	$("#mainImages").hide();
	$("#marshRailingImages2D").hide();


});

function recalculate() {
	try {
		getAllInputsValues(params);
		changeAllForms();
		drawStaircase('vl_1', true);

		drawTopFloor();
		redrawWalls();
		drawBanister();
		//расчет цены
		createMaterialsList(); // обнуляем список материалов
		staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
		calculateBanisterPrice(); //функция в файле priceCalcBanister.js
		calculatePrice();
		printMaterialsNeed();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}

function changeAllForms() {
	changeFormsGeneral();
	changeFormCarcas();
	changeFormRailing();
	changeFormBanisterConstruct();
	changeOffer();
	complectDescription();
	changeFormAssembling();
}

function configDinamicInputs() {
	changeFormBanister();
	changeFormTopFloor();
	changeFormLedges();
	changeAllForms();
}