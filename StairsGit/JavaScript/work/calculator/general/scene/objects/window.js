<<<<<<< HEAD
class Window extends AdditionalObject{
	windowClosed = true;
	windowMesh = false;
	window2Mesh = false;

	constructor(par){
		super(par);

		var wndObject = new THREE.Object3D();
		
		this.windowMesh = this.drawWindow();
		wndObject.add(this.windowMesh);
		if (this.par.windowsCount > 1) {
			var windowMesh = this.drawWindow(true);
			windowMesh.position.x = (this.par.width / this.par.windowsCount) * 2;
			wndObject.add(windowMesh);
			if (this.par.windowsCount == 2) this.window2Mesh = windowMesh;
		}
		if (this.par.windowsCount == 3) {
			this.window2Mesh = this.drawWindow(true);
			this.window2Mesh.position.x = (this.par.width / this.par.windowsCount) * 3;
			wndObject.add(this.window2Mesh);
		}
		
		var windowsillGeometry = new THREE.BoxGeometry( this.par.windowsillWidth, this.par.windowsillThickness, this.par.windowsillDepth );
		var windowsill = new THREE.Mesh( windowsillGeometry, this.material );
		windowsill.position.x = this.par.width / 2;
		windowsill.position.y = this.par.windowsillThickness / 2;
		windowsill.position.z = this.par.windowsillDepth / 2;
		wndObject.add(windowsill);

		wndObject.position.z = -40;

		this.add(wndObject);
	}

	drawWindow(translatePos){
		var wndWidth = this.par.width / (this.par.windowsCount * 1.0);

		var borderWidth = 70;

		var wnd = new THREE.Object3D();
		var borderSideGeometry = new THREE.BoxGeometry( borderWidth, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 40 );

		var borderLeft = new THREE.Mesh( borderSideGeometry, this.material );
		borderLeft.position.x = borderWidth / 2;
		borderLeft.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderLeft.position.z = 20;
		wnd.add(borderLeft);

		var borderRight = new THREE.Mesh( borderSideGeometry, this.material );
		borderRight.position.x = wndWidth - borderWidth / 2;
		borderRight.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderRight.position.z = 20;
		wnd.add(borderRight);

		var borderTopGeometry = new THREE.BoxGeometry( wndWidth, borderWidth, 40 );
		var borderTop = new THREE.Mesh( borderTopGeometry, this.material );
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = this.par.height - borderWidth / 2;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var borderTopGeometry = new THREE.BoxGeometry( wndWidth, borderWidth, 40 );
		var borderTop = new THREE.Mesh( borderTopGeometry, this.material );
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = borderWidth / 2 + this.par.windowsillThickness;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var windowInnerGeometry = new THREE.BoxGeometry( wndWidth - borderWidth * 2, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 20 );
		var windowInner = new THREE.Mesh( windowInnerGeometry, params.materials.glass );
		windowInner.position.x = (wndWidth - borderWidth * 2) / 2 + borderWidth;
		windowInner.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		windowInner.position.z = 20;
		wnd.add(windowInner);

		if (translatePos) {
			var wndWrapper = new THREE.Object3D();
			wnd.position.x -= wndWidth;
			wndWrapper.add(wnd);
			return wndWrapper;
		}else{
			return wnd;
		}
	}

	toggleDoor(){
		if (this.windowClosed) {
			this.addAnimation('openWindow', 500);
			this.windowClosed = false;
		}else{
			this.addAnimation('closeWindow', 500)
			this.windowClosed = true;
		}
	}

	animationProgress(animationName, progress){
		switch (animationName) {
			case 'openWindow':
				this.windowMesh.rotation.y = (-Math.PI / 2) * progress;
				if (this.window2Mesh) this.window2Mesh.rotation.y = (Math.PI / 2) * progress;
				break;
			case 'closeWindow':
				this.windowMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				if (this.window2Mesh) this.window2Mesh.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				break;
		}
	}

	getActions(){
		var actions = [];
		actions.push({
			title: 'Открыть/Закрыть окно',
			function: 'toggleDoor'
		})
		return actions;
	}

	/** STATIC **/
	static getMeta(){
		return {
			title: 'Окно',
			inputs: [
				{
					key: 'height',
					title: 'Высота окна',
					default: 1400,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина окна',
					default: 1100,
					type: 'number'
				},
				{
					key: 'windowsillDepth',
					title: 'Глубина подоконника',
					default: 300,
					type: 'number'
				},
				{
					key: 'windowsillWidth',
					title: 'Ширина подоконника',
					default: 1300,
					type: 'number'
				},
				{
					key: 'windowsillThickness',
					title: 'Толщина подоконника',
					default: 40,
					type: 'number'
				},
				{
					key: 'windowsCount',
					title: 'Количество секций',
					default: '1',
					values: [
						{
							value: '1',
							title: '1'
						},
						{
							value: '2',
							title: '2'
						},
						{
							value: '3',
							title: '3'
						}
					],
					type: 'select'
				}
			]
		}
	}
=======
class Window extends AdditionalObject{
	windowClosed = true;
	windowMesh = false;
	window2Mesh = false;

	constructor(par){
		super(par);

		var wndObject = new THREE.Object3D();
		
		this.windowMesh = this.drawWindow();
		wndObject.add(this.windowMesh);
		if (this.par.windowsCount > 1) {
			var windowMesh = this.drawWindow(true);
			windowMesh.position.x = (this.par.width / this.par.windowsCount) * 2;
			wndObject.add(windowMesh);
			if (this.par.windowsCount == 2) this.window2Mesh = windowMesh;
		}
		if (this.par.windowsCount == 3) {
			this.window2Mesh = this.drawWindow(true);
			this.window2Mesh.position.x = (this.par.width / this.par.windowsCount) * 3;
			wndObject.add(this.window2Mesh);
		}
		
		var windowsillGeometry = new THREE.BoxGeometry( this.par.windowsillWidth, this.par.windowsillThickness, this.par.windowsillDepth );
		var windowsill = new THREE.Mesh( windowsillGeometry, this.material );
		windowsill.position.x = this.par.width / 2;
		windowsill.position.y = this.par.windowsillThickness / 2;
		windowsill.position.z = this.par.windowsillDepth / 2;
		wndObject.add(windowsill);

		wndObject.position.z = -40;

		this.add(wndObject);
	}

	drawWindow(translatePos){
		var wndWidth = this.par.width / (this.par.windowsCount * 1.0);

		var borderWidth = 70;

		var wnd = new THREE.Object3D();
		var borderSideGeometry = new THREE.BoxGeometry( borderWidth, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 40 );

		var borderLeft = new THREE.Mesh( borderSideGeometry, this.material );
		borderLeft.position.x = borderWidth / 2;
		borderLeft.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderLeft.position.z = 20;
		wnd.add(borderLeft);

		var borderRight = new THREE.Mesh( borderSideGeometry, this.material );
		borderRight.position.x = wndWidth - borderWidth / 2;
		borderRight.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderRight.position.z = 20;
		wnd.add(borderRight);

		var borderTopGeometry = new THREE.BoxGeometry( wndWidth, borderWidth, 40 );
		var borderTop = new THREE.Mesh( borderTopGeometry, this.material );
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = this.par.height - borderWidth / 2;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var borderTopGeometry = new THREE.BoxGeometry( wndWidth, borderWidth, 40 );
		var borderTop = new THREE.Mesh( borderTopGeometry, this.material );
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = borderWidth / 2 + this.par.windowsillThickness;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var windowInnerGeometry = new THREE.BoxGeometry( wndWidth - borderWidth * 2, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 20 );
		var windowInner = new THREE.Mesh( windowInnerGeometry, params.materials.glass );
		windowInner.position.x = (wndWidth - borderWidth * 2) / 2 + borderWidth;
		windowInner.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		windowInner.position.z = 20;
		wnd.add(windowInner);

		if (translatePos) {
			var wndWrapper = new THREE.Object3D();
			wnd.position.x -= wndWidth;
			wndWrapper.add(wnd);
			return wndWrapper;
		}else{
			return wnd;
		}
	}

	toggleDoor(){
		if (this.windowClosed) {
			this.addAnimation('openWindow', 500);
			this.windowClosed = false;
		}else{
			this.addAnimation('closeWindow', 500)
			this.windowClosed = true;
		}
	}

	animationProgress(animationName, progress){
		switch (animationName) {
			case 'openWindow':
				this.windowMesh.rotation.y = (-Math.PI / 2) * progress;
				if (this.window2Mesh) this.window2Mesh.rotation.y = (Math.PI / 2) * progress;
				break;
			case 'closeWindow':
				this.windowMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				if (this.window2Mesh) this.window2Mesh.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				break;
		}
	}

	getActions(){
		var actions = [];
		actions.push({
			title: 'Открыть/Закрыть окно',
			function: 'toggleDoor'
		})
		return actions;
	}

	/** STATIC **/
	static getMeta(){
		return {
			title: 'Окно',
			inputs: [
				{
					key: 'height',
					title: 'Высота окна',
					default: 1400,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина окна',
					default: 1100,
					type: 'number'
				},
				{
					key: 'windowsillDepth',
					title: 'Глубина подоконника',
					default: 300,
					type: 'number'
				},
				{
					key: 'windowsillWidth',
					title: 'Ширина подоконника',
					default: 1300,
					type: 'number'
				},
				{
					key: 'windowsillThickness',
					title: 'Толщина подоконника',
					default: 40,
					type: 'number'
				},
				{
					key: 'windowsCount',
					title: 'Количество секций',
					default: '1',
					values: [
						{
							value: '1',
							title: '1'
						},
						{
							value: '2',
							title: '2'
						},
						{
							value: '3',
							title: '3'
						}
					],
					type: 'select'
				}
			]
		}
	}
>>>>>>> curve
}