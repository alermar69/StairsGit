class Menu{
	constructor(){
		this.el = $('#menu-form-wrapper');
		
		if (this.el) {
			this.createEventListeners();
		}
		
		this.elements = [];

		this.lastID = 0;
	}

	/**
	 * Создаем обработчики кнопок
	 */
	createEventListeners(){
		var _this = this;

		// Для чекбокса
		$('body').on('click', '.new-menu-wrapper .menu-item', function() {
			var el = $(this);
			var checkbox = el.find('[data-menu_checkbox]');
			if (checkbox.length) {
				var element_id = checkbox.data('element_id');
				if (element_id !== undefined) {
					var element = _this.getElement(element_id);
					if (element) {
						checkbox.attr('checked', !checkbox.is(':checked'));
						element.value = checkbox.is(':checked');
						if (element.callback) {
							element.callback(element);
						}
						if (element.type == 'layer') {
							_this.setLayerState(element.layerName, element.value);
						}
					}
				}
			}
		});

		// Для селекта
		$('body').on('change', '.new-menu-wrapper [data-menu_select]', function() {
			var el = $(this);
			var element_id = el.data('element_id');
			if (element_id !== undefined) {
				var element = _this.getElement(element_id);
				if (element) {
					element.value = el.val();
					if (element.callback) {
						element.callback(element);
					}
				}
			}
		});

		// Для сворачивания папок
		$('body').on('click', '.new-menu-wrapper [data-menu_folder]', function() {
			var el = $(this);
			var parent = el.parent();
			var elements = parent.find('.menu-group__content').toggle();
			if (elements.is(':visible')) {
				el.css('background-color', 'cornflowerblue');
			}else{
				el.css('background-color', 'lightgrey');
			}
		});
	}

	/**
	 * Ищет группу по имени
	 * @param {string} groupName имя группы
	 */
	getGroup(groupName){
		return this.elements.find(function(element){return element.title == groupName});
	}

	getElement(id){
		function checkElement(element){
			if (element.id == id) {
				return element;
			}
			if (element.elements) {
				for (var i = 0; i < element.elements.length; i++) {
					var el = checkElement(element.elements[i]);
					if (el) return el;
				}
			}
		}
		return checkElement(this);
	}

	/**
	 * Ищет слой по имени
	 * @param {string} layerName 
	 */
	getLayer(layerName){
		function checkElement(element){
			if (element.layerName == layerName) {
				return element;
			}
			if (element.elements) {
				for (var i = 0; i < element.elements.length; i++) {
					var el = checkElement(element.elements[i]);
					if (el) return el;
				}
			}
		}
		return checkElement(this);
	}

	/**
	 * Прибавляет ID чтобы получить актуальный ID для элемента
	 */
	getID(){
		this.lastID++;
		return this.lastID;
	}

	/**
	 * Устанавливает состояние для слоя 
	 * @param {string} layerName 
	 * @param {boolean} state 
	 */
	setLayerState(layerName, state){
		var layer = this.getLayer(layerName);
		if (layer) {
			layer.value = state;
			// var obj = view.scene.getObjectByLayerName(layer.layerName);
			var objects = view.scene.getObjectsByLayerName(layer.layerName);
			if (objects && objects.length > 0) {
				// obj.visible = layer.value;
				objects.setVisible(layer.value);
			}
			var el = $('.new-menu-wrapper [data-element_id=' + layer.id + ']');
			if (el) {
				el.attr('checked', layer.value);
			}
		}
		// this.render();
	}

	/**
	 * Метод для обновления состояния гуи, возможно стоит его упразднить, тк лишняя обертка...
	 */
	update(){
		this.render();
	}
	
	/**
	 * Отвечает за добавление слоёв
	 * @param {object} par.layerName - Имя слоя
	 * @param {object} par.title - Заголовк в меню
	 * @param {object} par.group - Элемент группы, если отсутсвует добавляем в группу слои
	 */
	addLayer(par){
		var layer = {
			id: this.getID(),
			layerName: par.layerName,
			title: par.title,
			value: true,
			type: 'layer'
		};

		var layerAdded = false;
		if (par.group && par.group.elements) {
			par.group.elements.push(layer);
			layerAdded = true;
		}else{
			var layersGroup = this.getGroup('Слои');
			if (!layersGroup) layersGroup = this.addGroup({title: 'Слои'});
			if (layersGroup) {
				layersGroup.elements.push(layer);
				layerAdded = true;
			}
		}

		// Проверяем что слой добавлен и getter/setter не созданы
		if (layerAdded && !this[layer.layerName]) {
			Object.defineProperty(this, layer.layerName, {
				get: function(){
					return layer.value;
				},
				set: function(state){
					layer.value = state;
					this.setLayerState(layer.layerName, state);
				}
			});
		}
	}

	/**
	 * Отвечает за добавление Чекбоксов
	 * @param {object} par.title - Заголовк в меню
	 * @param {object} par.callback - Функция которая вызывается в случае взаимодействия с элементом
	 * @param {object} par.state - Начальное сотояние
	 * @param {object} par.group - Элемент группы, если отсутсвует добавляем в корень
	 * @param {object} par.variableName - Имя переменной. необходимо если мы хотим иметь доступ к состоянию элемента с помощью menu[variableName], также позволяет изменять состояние: menu[variableName] = ... при этом вызывается callback и обновляется гуи
	 */
	addCheckbox(par){
		var element = {
			id: this.getID(),
			title: par.title,
			callback: par.callback,
			value: !!par.state,
			type: 'checkbox',
			variableName: par.variableName
		};

		var elementAdded = false;

		if (par.group && par.group.elements) {
			par.group.elements.push(element)
			elementAdded = true;
		}else{
			this.elements.push(element)
			elementAdded = true;
		}

		// Проверяем что элемент добавлен и getter/setter не созданы
		if (par.variableName && elementAdded && !this[par.variableName]) {
			Object.defineProperty(this, par.variableName, {
				get: function(){
					return element.value;
				},
				set: function(state){
					element.value = state;
					this.render();
					if (element.callback) {
						element.callback(element);
					}
				}
			});
		}
		this.render();
	}

	/**
	 * Отвечает за добавление селектов
	 * @param {object} par.title - Заголовк в меню
	 * @param {object} par.callback - Функция которая вызывается в случае взаимодействия с элементом
	 * @param {object} par.opions - Опции селекта, строки
	 * @param {object} par.group - Элемент группы, если отсутсвует добавляем в корень
	 * @param {object} par.variableName - Имя переменной. необходимо если мы хотим иметь доступ к состоянию элемента с помощью menu[variableName], также позволяет изменять состояние: menu[variableName] = ... при этом вызывается callback и обновляется гуи
	 */
	addSelect(par){
		var element = {
			id: this.getID(),
			title: par.title,
			callback: par.callback,
			value: par.options[0],
			options: par.options,
			type: 'select',
			variableName: par.variableName
		};

		var elementAdded = false;
		if (par.group && par.group.elements) {
			par.group.elements.push(element)
			elementAdded = true;
		}else{
			this.elements.push(element);
			elementAdded = true;
		}
		this.render();

		// Проверяем что элемент добавлен и getter/setter не созданы
		if (par.variableName && elementAdded && !this[par.variableName]) {
			Object.defineProperty(this, par.variableName, {
				get: function(){
					return element.value;
				},
				set: function(state){
					element.value = state;
					this.render();
					if (element.callback) {
						element.callback(element);
					}
				}
			});
		}

		return element;
	}

	/**
	 * Добавляет разделитель, вероятно практически не понадобится...
	 * @param {*} par 
	 */
	addDelimeter(par){
		var element = {
			id: this.getID(),
			title: par.title,
			type: 'delimeter',
		};

		if (par.group && par.group.elements) {
			par.group.elements.push(element)
		}else{
			this.elements.push(element)
		}
		this.render();

		return element;
	}

	/**
	 * Добавляет группу
	 * @param {string} par.title - Заголовок
	 * @param {string} par.group - Элемент группы, если необходимо добавить в группу
	 */
	addGroup(par){
		var group = {
			id: this.getID(),
			title: par.title,
			type: 'group',
			elements: [],
			variableName: par.variableName
		};

		if (par.group && par.group.elements) {
			par.group.elements.push(group);
		}else{
			this.elements.push(group);
		}
		this.render();

		return group;
	}

	/**
	 * Получает html строку для добавления в гуи
	 * @param {object} element 
	 */
	getElementHTML(element){
		if (element.type == 'delimieter') {
			return '<div class="menu-item" data-menu_delimeter><span>' + element.title + '</span></div>';
		}
		if (element.type == 'checkbox' || element.type == 'layer') {
			return '<div class="menu-item menu-item__clickable"><span>' + element.title + '</span><input data-menu_checkbox data-element_id=' + element.id + ' data-element_variable="' + (element.variableName || "") + '" type="checkbox" ' + (element.value ? 'checked' : '') + '></div>';
		}
		if (element.type == 'select' && element.options) {
			var selectHTML = '<div class="menu-item"><span>' + element.title + '</span><select data-menu_select data-element_id=' + element.id + ' data-element_variable="' + (element.variableName || "") + '">';
			element.options.forEach(function(option){
				selectHTML += '<option value="' + option + '" ' + (element.value == option ? 'selected' : '') + '>' + option + '</option>'
			});
			selectHTML += '</select></div>';

			return selectHTML;
		}
		if (element.type == 'group') {
			var groupHTML = '<div class="menu-group"><div class="menu-item" data-menu_folder><span>' + element.title + '</span></div><div class="menu-group__content">';
			if (element.elements && element.elements.length > 0) {
				element.elements.forEach(function(el){
					groupHTML += this.getElementHTML(el);
				}.bind(this));
				groupHTML += '</div></div>';
				return groupHTML;
			}
		}
	}

	/**
	 * Перерисовка гуи
	 */
	render(){
		if (this.el) {
			var _this = this;
			this.el.html('');
			this.elements.forEach(function(element){
				var elementHTML = _this.getElementHTML(element);
				_this.el.append(elementHTML);
			});
		}
	}
}