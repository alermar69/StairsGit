class Window extends AdditionalObject {
	constructor(par) {
		super(par);

		this.windowClosed = true;
		this.windowMesh = false;
		this.window2Mesh = false;

		var objPar = Object.assign({}, this.par)
		objPar.material = this.material;
		
		var wndObj = Window.draw(objPar);

		this.windowMesh = wndObj.windowMesh;
		this.window2Mesh = wndObj.window2Mesh;

		this.add(wndObj.mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var wndObject = new THREE.Object3D();

		par.windowMesh = Window.drawWindow(par);
		wndObject.add(par.windowMesh);
		/*
		if (par.windowsCount > 1) {
			var windowMesh = Window.drawWindow(par, true);
			windowMesh.position.x = (par.width / par.windowsCount) * 2;
			wndObject.add(windowMesh);
			if (par.windowsCount == 2) par.window2Mesh = windowMesh;
		}
		if (par.windowsCount == 3) {
			par.window2Mesh = Window.drawWindow(par, true);
			par.window2Mesh.position.x = (par.width / par.windowsCount) * 3;
			wndObject.add(par.window2Mesh);
		}
		*/
		var windowsillGeometry = new THREE.BoxGeometry(par.windowsillWidth, par.windowsillThickness, par.windowsillDepth);
		var windowsill = new THREE.Mesh(windowsillGeometry, par.material);
		windowsill.position.x = par.width / 2;
		windowsill.position.y = par.windowsillThickness / 2;
		windowsill.position.z = par.windowsillDepth / 2;
		wndObject.add(windowsill);

		wndObject.position.z = -40;

		par.mesh.add(wndObject);

		return par
	}

	static drawWindow(par, translatePos) {
		var wndWidth = par.width / (par.windowsCount * 1.0);
		/*

		var borderWidth = 70;

		var wnd = new THREE.Object3D();
		var borderSideGeometry = new THREE.BoxGeometry(borderWidth, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 40);

		var borderLeft = new THREE.Mesh(borderSideGeometry, this.material);
		borderLeft.position.x = borderWidth / 2;
		borderLeft.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderLeft.position.z = 20;
		wnd.add(borderLeft);

		var borderRight = new THREE.Mesh(borderSideGeometry, this.material);
		borderRight.position.x = wndWidth - borderWidth / 2;
		borderRight.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		borderRight.position.z = 20;
		wnd.add(borderRight);

		var borderTopGeometry = new THREE.BoxGeometry(wndWidth, borderWidth, 40);
		var borderTop = new THREE.Mesh(borderTopGeometry, this.material);
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = this.par.height - borderWidth / 2;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var borderTopGeometry = new THREE.BoxGeometry(wndWidth, borderWidth, 40);
		var borderTop = new THREE.Mesh(borderTopGeometry, this.material);
		borderTop.position.x = wndWidth / 2;
		borderTop.position.y = borderWidth / 2 + this.par.windowsillThickness;
		borderTop.position.z = 20;
		wnd.add(borderTop);

		var windowInnerGeometry = new THREE.BoxGeometry(wndWidth - borderWidth * 2, this.par.height - borderWidth * 2 - this.par.windowsillThickness, 20);
		var windowInner = new THREE.Mesh(windowInnerGeometry, params.materials.glass);
		windowInner.position.x = (wndWidth - borderWidth * 2) / 2 + borderWidth;
		windowInner.position.y = this.par.height / 2 + this.par.windowsillThickness / 2;
		windowInner.position.z = 20;
		wnd.add(windowInner);
		*/
		
		par.mat = par.material;
		var wnd = drawWindow(par).mesh
		
		if (translatePos) {
			var wndWrapper = new THREE.Object3D();
			wnd.position.x -= wndWidth;
			wndWrapper.add(wnd);
			return wndWrapper;
		} else {
			return wnd;
		}
	}

	toggleDoor() {
		if (this.windowClosed) {
			this.addAnimation('openWindow', 500);
			this.windowClosed = false;
		} else {
			this.addAnimation('closeWindow', 500)
			this.windowClosed = true;
		}
	}

	animationProgress(animationName, progress) {
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

	getActions() {
		var actions = [];
		actions.push({
			title: 'Открыть/Закрыть окно',
			function: 'toggleDoor'
		})
		return actions;
	}

	/** STATIC **/
	static getMeta() {
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
}

/** функция отрисовывает окно
*/
function drawWindow(par){
	initPar(par);
	if(!par.windowsillThickness) par.windowsillThickness = 0
	if(!par.windowsCount) par.windowsCount = 1
	
	var wndWidth = par.width / (par.windowsCount * 1.0);

	var borderWidth = 70;

	var borderSideGeometry = new THREE.BoxGeometry(borderWidth, par.height - borderWidth * 2 - par.windowsillThickness, 40);

	for(var i=0; i<par.windowsCount; i++){
		var posX = wndWidth * i;
		var borderLeft = new THREE.Mesh(borderSideGeometry, par.mat);
		borderLeft.position.x = borderWidth / 2 + posX;
		borderLeft.position.y = par.height / 2 + par.windowsillThickness / 2;
		borderLeft.position.z = 20;
		par.mesh.add(borderLeft);

		var borderRight = new THREE.Mesh(borderSideGeometry, par.mat);
		borderRight.position.x = wndWidth - borderWidth / 2 + posX;
		borderRight.position.y = par.height / 2 + par.windowsillThickness / 2;
		borderRight.position.z = 20;
		par.mesh.add(borderRight);

		var borderTopGeometry = new THREE.BoxGeometry(wndWidth, borderWidth, 40);
		var borderTop = new THREE.Mesh(borderTopGeometry, par.mat);
		borderTop.position.x = wndWidth / 2 + posX;
		borderTop.position.y = par.height - borderWidth / 2;
		borderTop.position.z = 20;
		par.mesh.add(borderTop);

		var borderTopGeometry = new THREE.BoxGeometry(wndWidth, borderWidth - 0.5, 40);
		var borderTop = new THREE.Mesh(borderTopGeometry, par.mat);
		borderTop.position.x = wndWidth / 2 + posX;
		borderTop.position.y = (borderWidth + 0.5) / 2 + par.windowsillThickness;
		borderTop.position.z = 20;
		par.mesh.add(borderTop);

		var windowInnerGeometry = new THREE.BoxGeometry(wndWidth - borderWidth * 2, par.height - borderWidth * 2 - par.windowsillThickness, 20);
		var windowInner = new THREE.Mesh(windowInnerGeometry, params.materials.glass);
		windowInner.position.x = (wndWidth - borderWidth * 2) / 2 + borderWidth + posX;
		windowInner.position.y = par.height / 2 + par.windowsillThickness / 2;
		windowInner.position.z = 20;
		par.mesh.add(windowInner);
	}
	
	return par
}

