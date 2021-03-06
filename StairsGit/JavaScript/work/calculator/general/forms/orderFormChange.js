var managers = [
	//офисные менеджеры
	{
	name:"Андрей Панков",
	photo: "pankov_andrey.jpg",
	phone:"8 (495) 125-11-78"
	},	
	{
	name:"Константин Кондратенко",
	photo: "dryzhbin_konstantin.jpg",
	phone:"8 (495) 125-11-78"
	},
	{
	name:"Константин Дружбин",
	photo: "dryzhbin_konstantin.jpg",
	phone:"8 (495) 125-11-78"
	},
	{
	name:"Сынжерян Дмитрий",
	photo: "dmitriy_synzheryan.jpg",
	phone:"8 (495) 125-11-78"
	},
	//замерщики
	{
	name:"Артур Саркисян",
	photo: "sarkisyan_artur.jpg",
	phone:"8 (964) 713-91-80"
	},
	{
	name:"Пилипенко Сергей",
	photo: "pilipenko_sergey.jpg",
	phone:"8 (926) 728-13-51"
	},
	{
	name:"Сергей Романов",
	photo: "romanov_sergey.jpg",
	phone:"8 (915) 087-70-46"
	},
	{
	name:"Алексей Маслов",
	photo: "maslov_aleksey.jpg",
	phone:"8 (925) 020-38-88"
	},
	{
	name:"Дубровский Сергей",
	photo: "sergey_dubrovskiy.jpg",
	phone:"8 (967) 191-9-167"
	},
	{
	name:"Максим Петренко",
	photo: "maxim_petrenko.jpg",
	phone:"8 (985) 757-69-48"
	},
	{
	name:"Константин Симбирев",
	photo: "konstantin_simbirev.jpg",
	phone:"8 (977) 259-04-74"
	},
	{
	name:"Станислав Синельников",
	photo: "stanislav_sinelnikov.jpg",
	phone:"8 (917) 104-41-49"
	}
];


$(function () {

	//информер о загрузке данных
	
	$(document).bind("ajaxSend", function(){
		$('#loader').show();
	}).bind("ajaxComplete", function(){
		$('#loader').hide();
		$('#updated').fadeIn(300).delay(1000).fadeOut(400);
	});
	
	//установка текущей даты
	var orderDate = $("#orderDate");
	var now = new Date();
	var month = now.getMonth() * 1.0 + 1;
	if(month < 10) month = "0" + month;
	var date = now.getDate();
	if(date < 10) date = "0" + date;
	var today = now.getFullYear() + "-" + month + "-" + date
	if(orderDate.val() == "2000-01-01") orderDate.val(today);
	
	//открытие модального окна
	$("#saveOfferModalShow").click(function () {
		var orderId = getOrderId(); //функция в файле dataExchangeXml_3.1.js
		$("#orderId").val(orderId);
		
		loadOfferData();
		
		$("#offerNameFormModal").modal('show');
		
		var url = document.location.href;
		if(url.indexOf("geometry") != -1) {
			$("#complectId").attr("type", "text");
			$("#complectId").attr("readonly", "true");
			$("#complectId").val('geom');
		}
		orderDate.val(today);
		
		configOfferNameInputs()
	});

	//инпут для текстового имени тестовых расчетов
	$("#offerNameForm input, #offerNameForm select, #offerNameForm textarea").change(function(){
		console.log("test")
		configOfferNameInputs();
	})
	
	$("#showPass").click(function(){
		alert("Логин: demo Пароль: demo_pass Как посмотреть модель: https://youtu.be/8zySuZ2spzg ")		
	});
	
	//защита от ввода дробных значений
	$("#offerNameTab input").change(function(){
		if($(this).val().indexOf(".") != -1) {
			alert("Введите целое число!")
			$(this).val(params[this.id]) 
		}
	})
	
	$("#headerType").change(function(){
		$(".header").hide();
		$(".footerText").hide();
		
		$("." + $(this).val()).show()
	})
	//изменение шапки при изменении параметров
	$("#kp_inputs input, #kp_inputs select").change(function(){
		changeOrderForm();
	});

	//двойной клик по тексту в шапке
	$('.changeInput').dblclick(function(){
		var id = $(this).attr('data-input_id');
		if ($('#' + id).length > 0) {
			var result = prompt("Введите значение", $('#' + id).val());
			if (result) {
				$('#' + id).val(result)
				changeOrderForm();
			}
		}else{
			alert("Инпут не найден")
		}
	});

	$("#customerName").change(function(){
		var russianName = new RussianName($("#customerName").val());
		var name = russianName.fullName(russianName.gcaseGen);
		$("#genitiveCaseCustomerName").val(name)
	})
});

/** функция заполняет данные в шапке по данным из формы
**/

function changeOrderForm(){
	//заполняем описание, если оно пустое
	if (params.kpDescription == "") {
		var descrText = "Красивая и удобная лестница по вашим размерам";
		if(params.calcType == "carport") descrText = "Красивый и надежный навес по вашим размерам";
		if(params.calcType == "veranda") descrText = "Красивая и удобная веранда по вашим размерам";
		if(params.calcType == "objects") descrText = "Красивые подоконники из массива по вашим размерам";
		$("#kpDescription").html(descrText);
	}
	
	//перебираем все параметры в форме и переносим данные в шапку
	$.each($('#kp_inputs select, #kp_inputs input, #kp_inputs textarea'), function(){
		var id = this.id;
		var el = $('[data-input_id="'+id+'"]');
		if (el.length > 0) {
			var val = $(this).val();
			//форматируем дату
			if($(this).attr("type") == "date") val = formatDate($(this).val(), "dd.MM.yy");
				
			if(el.find("span").html() != $(this).val()) el.find("span").html(val);
		}
	})
	
	//если нет имени клиента - скрываем поле
	$(".kp_header-wrapper div[data-input_id='customerName']").hide()
	if(params.customerName) $(".kp_header-wrapper div[data-input_id='customerName']").show()
	
	//задаем фон шапки
	
	var bgImg = ""
	if(params.hedarBgImg == "дерево") bgImg = "/images/calculator/new_kp/timber_bg.jpg"
	if(params.hedarBgImg == "металл") bgImg = "/images/calculator/new_kp/rif-steel.jpg"
	if(params.hedarBgImg == "нет") bgImg = ""
	$(".kp_header").css("background-image", "url(" + bgImg + ")")
	
}

/* функция показывает нужные инпуты для ввода имени расчета*/
function configOfferNameInputs(){
	$("#offerName_test").closest("div").hide();
	$("#offerNameTab").hide()
	
	if($("#status").val() == "тест") $("#offerName_test").closest("div").show()
	else $("#offerNameTab").show();

	// Обновляем описание, если автообновление
	if ($("#offerDataDescriptionUpdate").val() == 'авто') {
		$('#product_descr').attr('readonly', true);
		$("#product_descr").val(getExportData_com().product_descr);
	}else{
		$('#product_descr').attr('readonly', false);
	}
}