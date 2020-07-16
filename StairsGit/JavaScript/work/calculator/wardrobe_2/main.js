var params = {
	calcType: 'wardrobe_2',
	wardrobe: {
		dspThickness: 15,
		sections: [
			{
				className: 'Wardrobe',
				layer: 'wardrobe',
				position: {
					x:0,y:0,z:0
				},
				rotation: 0,
				meshParams: {
					"height": 1700,
					"width": 600,
					"depth": 600,
					"angle": 45,
					"shelfsCount": 2,
					"doorExist": true,
					"side": "левый",
					"dspThickness": 15
				}
			}
		]
	}
}; //глобальный массив значений инпутов
var model = {};

$(function(){
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId
	addTopFloor('vl_1');
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
			var data = JSON.parse(window.loadedData.order_data);
			params.wardrobe = data;
		} catch (error) {
			console.log(error);
		}
	}

	var meta = Wardrobe.getMeta();
	
	var helpers = {
		toNumber: function(val) {
			return val * 1.0;
		}
	};
	
	model = {
		wardrobe: params.wardrobe,
		inputs: meta.inputs,
		addSection: function() {
			var section = {
				position: {
					x:0,
					y:0,
					z:0
				},
				rotation: 0,
				className: 'Wardrobe',
				layer: 'wardrobe',
				meshParams: {}
			};
			meta.inputs.forEach(function(input){
				section.meshParams[input.key] = input.default;
			});
			$.observable(this.wardrobe.sections).insert(section);
		},
		removeSection: function(index) {
			$.observable(this.wardrobe.sections).remove(index);
		}
	};

	var template = $.templates("#wardrobeForm");
	template.link("#wardrobeFormContainer", model, helpers);

	$.observable(model.wardrobe).observeAll(function(e){
		redrawWardrobes();
	});


	recalculate();
})

function redrawWardrobes(){
	var wardrobes = view.scene.getObjectsByLayerName('wardrobe');
	if (wardrobes) {
		for (var i = 0; i < wardrobes.length; i++) {
			view.scene.remove(wardrobes[i]);
		}
	}

	params.wardrobe.sections.forEach(function(wardrobe){
		wardrobe.meshParams.dspThickness = params.wardrobe.dspThickness;
		addAdditionalObject(wardrobe);
	});
}

function recalculate(){
	rt1 = performance.now();
	var result = new Promise(function(resolve, reject){
		$('#loaderBlock').show({done: function(){
			try {
				redrawWardrobes();
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