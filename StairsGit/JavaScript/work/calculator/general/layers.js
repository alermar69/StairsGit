/** функция возвращает массив имен слоев для текущего модуля
*/

function getLayersList(){
	var notStairs = ['wardrobe', 'wardrobe_2', 'carport', 'table', 'slabs', 'sill', 'sideboard', 'coupe'];
	var layers = {
		treads: {
			name: "Ступени",
			not_for: notStairs,
			group: 'treads'
			},
		risers: {
			name: "Подступенки",
			not_for: ['vint', ...notStairs],
			group: 'treads'
			},
		angles: {
			name: "Уголки/рамки",
			not_for: ['railing', 'mono', 'timber', 'timber_stock', 'geometry', ...notStairs],
			group: 'carcas'
			},
		carcas: {
			name: "Каркас",
			not_for: ['railing'],
			group: 'carcas'
			},
		carcas1: {
			name: "Каркас1",
			not_for: ['railing', 'vint', ...notStairs],
			group: 'carcas'
			},
		railing: {
			name: "Ограждения лестницы",
			not_for: ['geometry', ...notStairs],
			group: 'railing'
			},
		topRailing: {
			name: "Балюстрада",
			not_for: ['railing', ...notStairs],
			group: 'railing'
			},
		forge: {
			name: "Ковка",
			not_for: ['railing', 'geometry', ...notStairs],
			group: 'railing'
			},
		handrails: {
			name: "Поручни",
			not_for: ['geometry', ...notStairs],
			group: 'railing'
			},
		newel: {
			name: "Столбы",
			not_for: ['geometry', ...notStairs],
			group: 'carcas'
			},
		newel1: {
			name: "Столбы_1",
			only_for: ['timber', 'timber_stock',],
			group: 'carcas'
			},
		newel2: {
			name: "Столбы_2",
			only_for: ['timber', 'timber_stock',],
			group: 'carcas'
			},
		newel3: {
			name: "Столбы_3",
			only_for: ['timber', 'timber_stock',],
			group: 'carcas'
			},
		metis: {
			name: "Метизы",
			not_for: ['geometry'],
			group: 'carcas'
			},
		wireframesinter: {
			name: "Пересечения",
			not_for: [],
			},
		dimensions: {
			name: "Размеры",
			not_for: [],
			},

		//специальные слои для монокосоуров
		treadPlates: {
			name: "Подложки",
			only_for: ['mono'],
			group: 'carcas'
			},
		flans: {
			name: "Фланцы",
			only_for: ['mono', 'carport'],
			group: 'carcas'
			},
		//специальные слои для ограждений
		concrete: {
			name: "Бетон",
			only_for: ['railing'],
			},
		//специальные слои для винтовой
		shims: {
			name: "Шайбы",
			only_for: ['vint'],
			group: 'carcas'
			},
		rod: {
			name: "Стержень",
			only_for: ['vint'],
			group: 'carcas'
			},
		stringers: {
			name: "Тетивы",
			only_for: ['vint'],
			group: 'carcas'
			},
		stringers2: {
			name: "Тетивы_2",
			only_for: ['vint'],
			group: 'carcas'
			},
		//специальные слои для навесов
		roof: {
			name: "Кровля",
			only_for: ['carport', 'veranda'],
			group: 'roof'
		},
		purlins: {
			name: "Прогоны",
			only_for: ['carport', 'veranda'],
			group: 'carcas'
		},
		racks: {
			name: "Колонны навеса",
			only_for: ['carport', 'veranda'],
			group: 'carcas'
		},
		//слои для столов
		countertop: {
			name: "Столешница",
			only_for: ['table', 'sideboard', 'coupe'],
			group: 'carcas'
		},
		
		panels: {
			name: "Панели",
			only_for: ['table'],
			group: 'carcas'
		},
		
		//слои для подоконников
		env: {
			name: "Обстановка",
			only_for: ['sill'],
			group: 'walls'
		},
		
		sill: {
			name: "Подоконник",
			only_for: ['sill'],
			group: 'carcas'
		},
		
		//слои для шкафов
		doors: {
			name: "Фасады",
			only_for: ['sideboard', 'coupe'],
			group: 'carcas'
		},
		
		panels: {
			name: "Пенели",
			only_for: ['sideboard', 'coupe'],
			group: 'carcas'
		},
		
		shelfs: {
			name: "Наполнение",
			only_for: ['sideboard', 'coupe', 'table'],
			group: 'carcas'
		},
		
		
		
		//общие слои
		walls: {
			name: "Стенки",
			only_for: ['carport', 'veranda'],
			group: 'carcas'
		},
		additionalObject: {
			name: 'Объекты',
			group: 'other'
		}
		
	}
	
	
return layers;
	
}

function getLayersByGroup(group){
	var allLayers = getLayersList();
	var layers = [];
	$.each(allLayers, function(key, item){
		if (item.group == group) {
			layers.push(key);
		}
	});
	return layers;
}