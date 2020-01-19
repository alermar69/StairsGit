/**класс, генерирующий сочетания параметров лестницы для тестирования
используются следующие параметры:
добавление параметра для перебора его значений
		параметры:
		id
		options: [],  - принудительно задавать список значений
		onlyFor: {
			model: "ко",
			}, - добавить параметр только к тем конфигурациям, которые содержат указанные свойства (не обязательный)
		ignorOptions: ["Прямая двухмаршевая"], - не добавлять некоторые варианты значений (не обязательный)
	
*/

function Configurator(){
	this.configs = []; //все конфигурации
	this.cur = 0; //текущая позиция
	
	this.addParToTest = function(par){
		//если варианты берутся из селекта по его id
		var selOptions =  $("#" + par.id + " option"); 
		var options = [];
		for(var i=0; i<selOptions.length; i++){
			options.push(selOptions[i].value);
			}
		//если варианты передаются явно в виде массива значений
		if(par.options) options = par.options; 
		
		var oldConfigs = this.configs;
		var newConfigs = [];
		
		//если добавляемый параметр добавляется не ко всем конфигурациям, разделяем oldConfigs на два массива: элементы, куда добавляем новый параметр и те, куда не добавляем
		var oldConfigComp = [] //конфигурации, совместимые с новым параметром
		var oldConfigUnComp = [] //конфигурации, НЕ совместимые с новым параметром
		
		if(par.onlyFor){
			for(var i=0; i<oldConfigs.length; i++){
			addParam = false;
			for(var prop in par.onlyFor){
				if(oldConfigs[i][prop] == par.onlyFor[prop]) addParam = true;
				}
			if(addParam) oldConfigComp.push(oldConfigs[i])
			if(!addParam) oldConfigUnComp.push(oldConfigs[i])
			}
			oldConfigs = oldConfigComp;
		}
		
		//перебираем варианты значений добавляемого параметра
		
		for(var i=0; i<options.length; i++){
			if(!par.ignorOptions || par.ignorOptions.indexOf(options[i]) == -1){
				//первичная инициализация
				if(oldConfigs.length == 0) oldConfigs.push({});
				for(var j=0; j<oldConfigs.length; j++){
					var item = {};
					//копируем имеющийся объект
					for(var prop in oldConfigs[j]){
						item[prop] = oldConfigs[j][prop];
						}
					//добавляем новый параметр
					item[par.id] = options[i];
					
					//проверяем корректность конфигурации
					var correctConfig = true;
					if(par.onlyFor){
						correctConfig = false;
						for(var prop in par.onlyFor){
							if(item[prop] == par.onlyFor[prop]) correctConfig = true;
							}
						}
					if(correctConfig) newConfigs.push(item);
					}
				} //end of cycle
			}
		this.configs = newConfigs;
		if(oldConfigUnComp.length > 0) this.configs = this.configs.concat(oldConfigUnComp);
		} //end of addParToTest
		
	this.getNextConfig = function(){
		if(this.cur < this.configs.length-1) {
			this.cur ++;
			$("#configId").val(this.cur);
			
			return this.configs[this.cur];			
			} 		
		return false;
		}
	this.getPrevConfig = function(){
		if(this.cur > 0) {
			this.cur -= 1;
			$("#configId").val(this.cur);
			
			return this.configs[this.cur];
			
			} 		
		return false;
		}
	
	this.resetCounter = function(){
		this.cur = 0;
		$("#configId").val(this.cur);
		}
	this.getConfig = function(id){
		this.cur = id;
		$("#configId").val(this.cur);
		return this.configs[id];
		}

}//end of configurator

/** функция запускает тест для текущей конфигуарции
*/
function doBoltTest(bd){
	//устанавливаем значения глобальных параметров для теста
	boltDiam = bd;
	boltBulge = 1; //выступ болта за плоскость родительской детали	
	if(params.calcType != "mono") boltLen = 10;
	anglesHasBolts = true;
	drawLongBolts = true;
	var testName = "Болты Ф" + bd;
	
	
	if(bd == 0) {
		testName = "Болтов нет";
		anglesHasBolts = false;
		drawLongBolts = false;
		}
	if($("#testingMode").val() == "дерево1" || $("#testingMode").val() == "дерево2") testName = $("#testingMode").val();

	setHiddenLayers();
	recalculate();

	var url = document.location.href;
	var link = url.substring(0, url.indexOf('?')) + "?orderName=" + $("#orderName").val();
	
	var text = $("#orderName").val() + " Конфигурация №: <span class='configId'>" + configurator.cur + "</span> " + testName + " ";
	if($("#configGeneratorMode").val() == "последние")
		text = "<a href='" + link + "' target='_blank'>" + $("#orderName").val() + "</a> " + testName + " ";
		
	$("#testResults").append(text);
	
};

/** функция устанавливает конфигурацию по ее id
*/
function setConfig(id){
	var config = configurator.getConfig(id);
	applyConfiguration(config);
	recalculate();
}

/** функция устанавливает в инпуты параметры конфигурации
*/
function applyConfiguration(config) {
	for(var prop in config) {
		$("#" + prop).val(config[prop]);
	}
}

/**устанавливает следующую конфигурацию
*/
function setNextConfig(){
	var config = configurator.getNextConfig();
	applyConfiguration(config);
	recalculate();	
}

/**устанавливает предыдущую конфигурацию
*/
function setPrevConfig(){
	var config = configurator.getPrevConfig();
	applyConfiguration(config);
	recalculate();	
}

function queueFindIntersects(onFinish) {
	setTimeout(function run() {
		findIntersects($['vl_1'], 'vl_1', function (count) {
			if (onFinish) {
				onFinish(count);
			}
		});
	}, 1000);
}

function queueConfigurationTest(onFinish) {
	
	//первый этап тестирования
	var testingMode = $("#testingMode").val();
	var bd = 0;
	if(testingMode == "болты Ф12" || testingMode ==  "болты Ф12 + Ф14") bd = 12;	
	if(testingMode == "болты Ф14") bd = 14;
	doBoltTest(bd);
	queueFindIntersects(function(count1) {			
		//второй этап тестирования только если тест двойной и первый тест не провален
		if (count1 == 0 && testingMode ==  "болты Ф12 + Ф14") { 
			doBoltTest(14);
			queueFindIntersects(function (count2) {
				if (onFinish) {
					onFinish();
				}
			});
		}
		else {
			if (onFinish) {
				onFinish();
			}
		}
	});
}
	
	
/**
 * Пример функции вызова теста для проверки точности отрисовки ступеней
 * @param material - тестовый материал
 */
function compareLayers(callback) {
    setTimeout(function () {
        var sphereSetting = {
            position: {  // маркер ошибки позиции
                radius: params.treadThickness * 0.5,
                color: 0xffc830
            },
            form: {       // маркер ошибки формы
                radius: params.treadThickness * 2,
                color: 0xff5555
            }
        };

        // параметры теста
        var setting = {
            viewportId: 'vl_1',
            pattern: treads,
            devCopy: treads_new,
            sphereSetting: sphereSetting,
			};
			
		if($("#testingMode").val() == "сравнение каркаса"){
			setting = {
				viewportId: 'vl_1',
				pattern: carcas,
				devCopy: carcas_new,
				sphereSetting: sphereSetting,
				};
			}
		
        var t = new TestSamples(setting);
        var testResult = t.startTest();
        if (testResult) {
            var text = "<div class='testResult'>Конфигурация №: <span class='configId'>" + $('#configId').val() +
                "</span> Тест пройден <br/></div>";
        } else {
            var d = new Date();
            var u = 's_' + d.getTime();
            var text = '<div class="testResult  spoiler-wrapper">' +
                '<div class="spoiler folded"><a onclick="$(\'#' + u + '\').slideToggle()" class="error">' +
                'Конфигурация №: <span class="configId">' + $('#configId').val() + '</span> Отладочный тест (c ошибками)' +

                ' <br/></div>' +
                '<div class="spoiler-text" id="' + u + '" style="display:none;">' +
                '<div onclick="$(\'#configId\').val(' + $('#configId').val() + ');$(\'#setConfig\').click();">Открыть</div>' +
                t.getResult() + '</div> </div>';
        }


        $("#testResults").append(text);
        if(callback) callback();
    }, 2000)
}; //end of compareLayers

function compareSizes(callback){
	window.testingCallback = function(){
		var url = document.location.href;
		var link = url.substring(0, url.indexOf('?')) + "?orderName=" + $("#orderName").val();

		var text = "<a href='" + link + "' target='_blank'>" + $("#orderName").val() + "</a> " + $("#testingMode").val() + " ";
		

		text += $("#compareResult").html() + "<br/>";
		
		$("#testResults").append(text);
		
		window.testingCallback = null;
		if (callback) callback();
	};
  if (window.ladderLoaded) {
    window.testingCallback();
  }
	// setTimeout(()=>{
	// }, 2000);
};


/** функция устанавливает список слоев, которые не орисовываются в режиме тестирования

*/

function setHiddenLayers(){

	if(!testingMode) return;
	hidenLayers = ["forge", "topFloor", "floorBottom", "wall1", "wall2", "wall3", "wall4", "topRailing", "dimensions", "newell_fixings"];
	//if(params.calcType == "mono") hidenLayers.push("handrails", "railing")
	if($("#handrailFixType").val() == "паз") hidenLayers.push("handrails");
	if($("#testingMode").val() == "дерево1") hidenLayers.push("newel1", "newel3");
	if($("#testingMode").val() == "дерево2") hidenLayers.push("newel", "newel2");
	if(params.calcType == "vint") hidenLayers.push("handrails", "stringers", "rigels", "rod", "stringers2")
	menu.boltHead = false;
}


function testConfigs_synth(){

	testingMode = params.testingMode;
	$("#testResults").html("");

	configurator.resetCounter();
	setConfig(configurator.cur);
	stopTesting = false
	
	function testWorker(left) {
		if(stopTesting) return;
		queueConfigurationTest(function () {
			if (left > 1) {
				setNextConfig();
				testWorker(left - 1);					
				}
			//отключаем режим тестирования
			else {
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
				}
		});
	};
	
	//тест сравнения
	function testWorkerDev(left) {
		if(stopTesting) return;
		compareLayers(function(){
			if (left > 1) {
				setNextConfig();
				testWorkerDev(left - 1);
				}
			//отключаем режим тестирования
			else {
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
				}
		});
	};
	
	function testWorkerSizes(left) {
		if(stopTesting) return;
		compareSizes(function(){
			if (left > 1) {
				setNextConfig();
				setTimeout(function(){
					testWorkerSizes(left - 1);
					}, 10);
				
			} else { //отключаем режим тестирования
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
			}
		});
	};
	
	function testSpec(left) {
		if(stopTesting) return;
		checkSpec(function(){
			if (left > 1) {
				setNextConfig();
				testSpec(left - 1);
			} else { //отключаем режим тестирования
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
			}
		});
	};
	
	function testSpec_vhod(left) {
		if(stopTesting) return;
		checkSpec_vhod(function(){
			testingMode = false;
			if (left > 1) {
				setNextConfig();
				testSpec_vhod(left - 1);
			} else { //отключаем режим тестирования
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
			}
		});
	};

	
	function testWorkerNo(left) {
		if(stopTesting) return;
		setTimeout(function(){
			if (left > 1) {
				setNextConfig();
				testWorkerNo(left - 1);
				}
			//отключаем режим тестирования
			else {
				hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
				testingMode = false;
				}
			}, 5);
		};

	

	var configAmt = params.configAmt;
	if(configAmt > configurator.configs.length) configAmt = configurator.configs.length;
	$("#configAmt").val(configAmt);
	var testType = getTestType();
	if(testType == "intercections") testWorker(configAmt);
	if(testType == "compare") testWorkerDev(configAmt);
	if(testType == "noTest") testWorkerNo(configAmt);
	if(testType == "sizes") testWorkerSizes(configAmt);
	if(testType == "spec") testSpec(configAmt);
	if(testType == "spec_vhod") testSpec_vhod(configAmt);
};

function getTestType(){
	//функция возвращает тип теста
	var mode = $("#testingMode").val();

	var testType = "intercections";
	if(mode == "сравнение ступеней" || mode == "сравнение каркаса") testType = "compare";
	if(mode == "критические ошибки") testType = "noTest";
	if(mode == "размеры") testType = "sizes";
	if(mode == "спецификация") testType = "spec";
	if(mode == "спецификация вход") testType = "spec_vhod";
	


	return testType;
}

