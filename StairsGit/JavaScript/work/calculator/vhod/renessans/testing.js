/** в этом файле собраны функции для автоматического тестирования */

$(function() {
	//обработчик кнопки тест
	$("#startTest").click(function(){
		console.log("startTest");
		
		//добавляем все сочетания параметров из формы
		var configurator = new Configurator();
		$("#paramsTable select").each(function(){
			configurator.addParToTest({id: this.id});
		})
		
		//еребираем все конфигурации и проверяем чтобы цена для каждой конфигураии была числом
		var nanAmt = 0;
		for(var i=0; i<configurator.configs.length; i++){
			var config = configurator.configs[i];
			var priceData = calcPrice(config);
			if(!isFinite(priceData.totalCost)){
				nanAmt++;
				console.log(priceData.totalCost, config)
			}			
		}
		
	var result = "<h4>Результаты теста</h4>" +
		"Проверено " + configurator.configs.length + " конфигураций.<br/>Обнаружено ошибок: " + nanAmt + "<br/>";
		if(nanAmt == 0) result += "Тест пройден";
		else result += "Тест НЕ пройден";
	$("#result_all").html(result);
		
	})
});

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