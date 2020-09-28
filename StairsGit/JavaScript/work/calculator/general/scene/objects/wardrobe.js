class Wardrobe extends AdditionalObject {

	doorMesh = false;
	doorClosed = true;

	constructor(par) {
		super(par);
		var obj = this;

		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
				x: 0,
				y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			material: params.materials.timber
		};

		var meta = Wardrobe.getMeta();
		meta.inputs.forEach(function (input) {
			sectParams[input.key] = obj.par[input.key];
		})

		sectParams = Wardrobe.draw(sectParams);

		obj.add(sectParams.mesh);

		this.doorMesh = sectParams.doorMesh;
	}


	toggleDoor() {
		if (this.par.door != 'нет') {
			if (this.doorClosed) {
				this.addAnimation('openDoor', 500);
				this.doorClosed = false;
			} else {
				this.addAnimation('closeDoor', 500)
				this.doorClosed = true;
			}
		}
	}

	animationProgress(animationName, progress) {
		switch (animationName) {
			case 'openDoor':
				this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				break;
		}
	}

	getActions() {
		var actions = [];
		if (this.par.door != 'нет') {
			actions.push({
				title: 'Открыть/Закрыть дверцу',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	static calcPrice(par) {
		var meshParams = par.meshParams;
		var price = meshParams.height * 12; // Пример
		return {
			name: meshParams.name || this.getMeta().title,
			cost: price,
			priceFactor: meshParams.priceFactor || 1,
			costFactor: meshParams.costFactor || 1
		}
	}

	static draw(par) {
		if (!par) par = {};
		initPar(par)

		var dspThikness = par.dspThickness || 16;

		var radAngle = THREE.Math.degToRad(par.angle);
		var p0 = {
			x: 0,
			y: par.height - par.legsHeight
		};
		var p1 = itercection(p0, polar(p0, radAngle, 100), {
			x: par.width,
			y: 0
		}, {
			x: par.width,
			y: 100
		});
		var length = distance(p0, p1);

		if (par.side == 'левый') {
			var side1Geometry = new THREE.BoxGeometry(dspThikness, par.height - par.legsHeight, par.depth);
			var side2Geometry = new THREE.BoxGeometry(dspThikness, p1.y - dspThikness * Math.tan(radAngle), par.depth);
		} else {
			var side1Geometry = new THREE.BoxGeometry(dspThikness, p1.y - dspThikness * Math.tan(radAngle), par.depth);
			var side2Geometry = new THREE.BoxGeometry(dspThikness, par.height - par.legsHeight, par.depth);
		}
		var botGeometry = new THREE.BoxGeometry(par.width, dspThikness, par.depth);
		var topGeometry = new THREE.BoxGeometry(length - dspThikness / Math.cos(radAngle), dspThikness, par.depth);
		topGeometry.translate(0, -dspThikness / 2, 0);
		var topPos = polar(p0, radAngle, (length - dspThikness / Math.cos(radAngle)) / 2);

		if (radAngle == 0) {
			topGeometry = botGeometry;
			side1Geometry = new THREE.BoxGeometry(dspThikness, par.height - par.legsHeight - dspThikness * 2, par.depth);
			side2Geometry = side1Geometry
			topPos = newPoint_xy(p0, par.width / 2, -dspThikness / 2)
		}

		var top = new THREE.Mesh(topGeometry, par.material);


		top.position.x = topPos.x;
		top.position.y = topPos.y;
		top.position.z = par.depth / 2;

		if (par.side == 'левый') {
			top.rotation.z = radAngle;
		} else {
			top.rotation.z = -radAngle;
		}

		par.mesh.add(top);


		var side1 = new THREE.Mesh(side1Geometry, par.material);
		side1.position.x = dspThikness / 2;
		side1.position.y = side1Geometry.parameters.height / 2 + dspThikness;
		side1.position.z = par.depth / 2;
		par.mesh.add(side1);

		var side2 = new THREE.Mesh(side2Geometry, par.material);
		side2.position.x = par.width - dspThikness / 2;
		side2.position.y = side2Geometry.parameters.height / 2 + dspThikness;
		side2.position.z = par.depth / 2;
		par.mesh.add(side2);

		var bot = new THREE.Mesh(botGeometry, par.material);
		bot.position.x = par.width / 2;
		bot.position.y = dspThikness / 2;
		bot.position.z = par.depth / 2;
		par.mesh.add(bot);

		//наполнение
		var shelfOffset = 20; //утапливание полки относительно передней кромки
		var step = (par.height - par.legsHeight - dspThikness) / (par.shelfsAmt + 1)
		var shelfGeometry = new THREE.BoxGeometry(par.width - dspThikness * 2, dspThikness, par.depth - shelfOffset);

		for (let i = 1; i <= par.shelfsAmt; i++) {
			var offset = step * i;
			var shelf = new THREE.Mesh(shelfGeometry, par.material);
			shelf.position.x = par.width / 2;
			shelf.position.y = dspThikness / 2 + offset;
			shelf.position.z = par.depth / 2 - shelfOffset / 2;
			par.mesh.add(shelf);
		}

		var doorP1 = {
			x: 0,
			y: 0
		};
		var doorP2 = p0;
		var doorP3 = p1;
		var doorP4 = {
			x: par.width,
			y: 0
		};

		if (par.side == 'правый') {
			var doorP1 = {
				x: 0,
				y: 0
			};
			var doorP2 = {
				x: 0,
				y: p1.y
			};
			var doorP3 = {
				x: par.width,
				y: par.height - par.legsHeight
			};
			var doorP4 = {
				x: par.width,
				y: 0
			};
		}

		//создаем шейп
		var shapePar = {
			points: [doorP1, doorP2, doorP3, doorP4],
			dxfArr: [],
			dxfBasePoint: {
				x: 0,
				y: 0
			},
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: 1,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var back = new THREE.Mesh(geom, par.material);
		back.position.z -= 1;
		par.mesh.add(back);

		//дверка
		if (par.door != "нет") {
			var extrudeOptions = {
				amount: dspThikness,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};
			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var doorWrapper = new THREE.Object3D();
			var door = new THREE.Mesh(geom, par.material);
			doorWrapper.position.z = par.depth;
			doorWrapper.add(door);
			par.mesh.add(doorWrapper);

			par.doorMesh = doorWrapper;

			//ручка
			if (par.handle != "нет") {
				var handle = drawHandle().mesh;
				handle.position.y = par.height / 2;
				handle.position.x = 50;
				if (par.side == 'левый') handle.position.x = par.width - 50;
				handle.position.z = dspThikness;
				doorWrapper.add(handle);
			}
		}

		//ножки
		if (par.legsHeight) {
			par.legPar = {
				diam: 50,
				sideOffset: 20,
			}
			var pipeGeometry = new THREE.CylinderGeometry(par.legPar.diam / 2, par.legPar.diam / 2, par.legsHeight, 32);

			var legMoove = par.legPar.sideOffset + par.legPar.diam / 2;

			var legPos = {
				frontZ: par.depth - legMoove,
				rearZ: legMoove,
				leftX: legMoove,
				rightX: par.width - legMoove,
				y: -par.legsHeight / 2,
			}

			//левая задняя
			var pipe = new THREE.Mesh(pipeGeometry, params.materials.inox);
			pipe.position.x = legPos.leftX;
			pipe.position.y = legPos.y;
			pipe.position.z = legPos.rearZ;

			par.mesh.add(pipe);

			//левая передняя
			var pipe = new THREE.Mesh(pipeGeometry, params.materials.inox);
			pipe.position.x = legPos.leftX;
			pipe.position.y = legPos.y;
			pipe.position.z = legPos.frontZ;

			par.mesh.add(pipe);

			//правая задняя
			var pipe = new THREE.Mesh(pipeGeometry, params.materials.inox);
			pipe.position.x = legPos.rightX;
			pipe.position.y = legPos.y;
			pipe.position.z = legPos.rearZ;

			par.mesh.add(pipe);

			//правая передняя
			var pipe = new THREE.Mesh(pipeGeometry, params.materials.inox);
			pipe.position.x = legPos.rightX;
			pipe.position.y = legPos.y;
			pipe.position.z = legPos.frontZ;

			par.mesh.add(pipe);
		}

		return par
	}

	static getMeta() {
		return {
			title: 'Шкаф',
			inputs: [

				{
					key: 'height',
					title: 'Высота',
					default: 1700,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 600,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 600,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'angle',
					title: 'Угол верха',
					default: 0,
					type: 'number'
				},
				{
					key: 'shelfsAmt',
					title: 'Кол-во полок',
					default: 2,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'door',
					title: 'Дверка',
					default: 'плоская',
					values: [{
							value: 'плоская',
							title: 'плоская'
						},
						{
							value: 'рамочная',
							title: 'рамочная'
						},
						{
							value: 'стекло в рамке',
							title: 'стекло в рамке'
						},
						{
							value: 'нет',
							title: 'нет'
						},
					],
					type: 'select',
					"printable": "true",
				},
				{
					key: 'handle',
					title: 'Ручка',
					default: 'нет',
					values: [{
							value: 'нет',
							title: 'нет'
						},
						{
							value: 'скоба',
							title: 'скоба'
						},
					],
					type: 'select'
				},

				{
					key: 'content',
					title: 'Наполнение',
					default: 'полки',
					values: [{
							value: 'полки',
							title: 'полки'
						},
						{
							value: 'ящики',
							title: 'ящики'
						},
					],
					type: 'select',
					"printable": "true",
				},

				{
					key: 'side',
					title: 'Направление',
					default: 'левый',
					values: [{
							value: 'левый',
							title: 'Левый'
						},
						{
							value: 'правый',
							title: 'Правый'
						}
					],
					type: 'select'
				},

				{
					key: 'legsHeight',
					title: 'Ножки',
					default: 90,
					type: 'number'
				},

				{
					type: 'delimeter',
					"title": "Цена"
				},

				{
					key: 'name',
					title: 'Название',
					default: 'Шкаф',
					type: 'text'
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}