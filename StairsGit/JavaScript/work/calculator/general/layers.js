/** функция возвращает массив имен слоев для текущего модуля
*/

function getLayersList(){
	var layers = {
		treads: {
			name: "Ступени",
			not_for: ['railing'],
			},
		risers: {
			name: "Подступенки",
			not_for: ['railing', 'vint'],
			},
		angles: {
			name: "Уголки/рамки",
			not_for: ['railing', 'mono', 'timber', 'timber_stock', 'geometry'],
			},
		carcas: {
			name: "Каркас",
			not_for: ['railing'],
			},
		carcas1: {
			name: "Каркас1",
			not_for: ['railing', 'vint'],
			},
		railing: {
			name: "Ограждения лестницы",
			not_for: ['geometry'],
			},
		topRailing: {
			name: "Балюстрада",
			not_for: ['railing'],
			},
		forge: {
			name: "Ковка",
			not_for: ['railing', 'geometry'],
			},
		handrails: {
			name: "Поручни",
			not_for: ['geometry'],
			},
		newel: {
			name: "Столбы",
			not_for: ['geometry'],
			},
		newel1: {
			name: "Столбы_1",
			only_for: ['timber', 'timber_stock'],
			},
		newel2: {
			name: "Столбы_2",
			only_for: ['timber', 'timber_stock'],
			},
		newel3: {
			name: "Столбы_3",
			only_for: ['timber', 'timber_stock'],
			},
		metis: {
			name: "Метизы",
			not_for: ['geometry'],
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
			},
		flans: {
			name: "Фланцы",
			only_for: ['mono'],
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
			},
		rod: {
			name: "Стержень",
			only_for: ['vint'],
			},
		stringers: {
			name: "Тетивы",
			only_for: ['vint'],
			},
		stringers2: {
			name: "Тетивы_2",
			only_for: ['vint'],
			},
	}
	
return layers;
	
}