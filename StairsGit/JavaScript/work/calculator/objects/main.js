var params = {
	calcType: 'objects',
	floorThickness: 300,
	floorOffsetBot: 0,
	objects: []
}; //глобальный массив значений инпутов
var model = {};

$(function(){

	var type = $.urlParam('type');
	if (type == 'wardrobe') params.className = 'Wardrobe';
	if (type == 'table') params.className = 'Table';

	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId
	addFloorPlane('vl_1', true);
	addMeasurement('vl_1');
	//Добавляем слои в 3Д меню
	layers = getLayersList();
	for(var layer in layers){
		var needAdd = true;
		if(layers[layer]['not_for'] && layers[layer]['not_for'].indexOf(params.calcType) != -1) needAdd = false;
		if(layers[layer]['only_for'] && layers[layer]['only_for'].indexOf(params.calcType) == -1) needAdd = false;
		if(needAdd) addLayer(layer, layers[layer]['name']);
	}
	//конфигурируем правое меню
	$(".tabs").lightTabs();

	// пересчитываем лестницу
	if (window.loadedData) {
		try {
			var data = JSON.parse(window.loadedData.objects);
			if (data.length > 0) {
				objects = data.filter(function(item){return item.className == params.className});
				params.objects = objects;
			}
		} catch (error) {
			console.log(error);
		}
	}

	var meta = eval(params.className+'.getMeta()');
	
	var helpers = {
		toNumber: function(val) {
			return val * 1.0;
		}
	};
	
	model = {
		objects: params.objects,
		inputs: meta.inputs,
		addObject: function() {
			var object = {
				position: {
					x:0,
					y:0,
					z:0
				},
				rotation: 0,
				className: params.className,
				meshParams: {}
			};
			meta.inputs.forEach(function(input){
				object.meshParams[input.key] = input.default;
			});
			$.observable(this.objects).insert(object);
		},
		removeObject: function(index) {
			$.observable(this.objects).remove(index);
		}
	};

	var template = $.templates("#objectsFormTemplate");
	template.link("#objectsFormContainer", model, helpers);

	$.observable(model.objects).observeAll(function(e){
		redrawObjects();
	});
	

	recalculate();
})

function redrawObjects(){
	var objects = view.scene.getObjectsByLayerName('object');
	if (objects) {
		for (var i = 0; i < objects.length; i++) {
			view.scene.remove(objects[i]);
		}
	}

	params.objects.forEach(function(object){
		object.layer = 'object';
		addAdditionalObject(object);
	});
}

function recalculate(){
	rt1 = performance.now();
	var result = new Promise(function(resolve, reject){
		$('#loaderBlock').show({done: function(){
			try {
				redrawObjects();
				window.mainObj = view.scene;
				resolve();
			}catch (error) {
				prepareFatalErrorNotify(error);
				reject();
			}
		}});
	});

	result.finally(function(){
		$('#loaderBlock').hide();
	});
}