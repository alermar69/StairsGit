/** функция возвращает массив имен слоев для текущего модуля
*/

function getLayersList(){
	var layers = {
		treads: {
			name: "Ступени",
			not_for: ['railing', 'carport'],
			group: 'treads'
			},
		risers: {
			name: "Подступенки",
			not_for: ['railing', 'vint', 'carport'],
			group: 'treads'
			},
		angles: {
			name: "Уголки/рамки",
			not_for: ['railing', 'mono', 'timber', 'timber_stock', 'geometry'],
			group: 'carcas'
			},
		carcas: {
			name: "Каркас",
			not_for: ['railing'],
			group: 'carcas'
			},
		carcas1: {
			name: "Каркас1",
			not_for: ['railing', 'vint', 'carport'],
			group: 'carcas'
			},
		railing: {
			name: "Ограждения лестницы",
			not_for: ['geometry', 'carport'],
			group: 'railing'
			},
		topRailing: {
			name: "Балюстрада",
			not_for: ['railing', 'carport'],
			group: 'railing'
			},
		forge: {
			name: "Ковка",
			not_for: ['railing', 'geometry', 'carport'],
			group: 'railing'
			},
		handrails: {
			name: "Поручни",
			not_for: ['geometry', 'carport'],
			group: 'railing'
			},
		newel: {
			name: "Столбы",
			not_for: ['geometry'],
			group: 'carcas'
			},
		newel1: {
			name: "Столбы_1",
			only_for: ['timber', 'timber_stock'],
			group: 'carcas'
			},
		newel2: {
			name: "Столбы_2",
			only_for: ['timber', 'timber_stock'],
			group: 'carcas'
			},
		newel3: {
			name: "Столбы_3",
			only_for: ['timber', 'timber_stock'],
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
		labels: {
			name: "Номера стен",
			not_for: ['carport'],
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
			only_for: ['carport'],
			group: 'roof'
		},
		progon: {
			name: "Прогоны",
			only_for: ['carport'],
			group: 'progon'
		},
		racks: {
			name: "Опоры",
			only_for: ['carport'],
			group: 'racks'
		},
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