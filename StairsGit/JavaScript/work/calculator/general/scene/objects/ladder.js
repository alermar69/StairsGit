class Ladder extends AdditionalObject {
	constructor(par) {
		super(par);
		var size = this.par.size;

		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
				x: 0,
				y: 0
			},
			sectType: this.par.sectType,
			h: this.par.h,
			b: this.par.b,
			stairAmt: this.par.stairAmt,
			turnAngle: this.par.turnAngle,
			offsetIn: this.par.offsetIn,
			sectLen: this.par.sectLen,
			sectWidth: this.par.sectWidth,
			sectWidthS: this.par.sectWidthS,
			sectThk: this.par.sectThk,
			cutSide: this.par.cutSide,
			marshType: this.par.marshType,
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			M: this.par.M
		};

		//общие параметры
		sectParams.material = this.material;

		sectParams = Ladder.draw(sectParams);

		this.add(sectParams.mesh);
	}

	static draw(par) {
		if (!par) par = {};
		initPar(par);

		par.M = par.sectWidth;
		par.mesh = new THREE.Object3D();
		var shape = new THREE.Shape();
		//var dxfBasePoint = { "x": 0.0, "y": 0.0 };
		//ступени
		var points = [];
		var point = {
			"x": 0.0,
			"y": 0.0
		};
		points.push(point)

		for (var i = 0; i < par.stairAmt; i++) {
			point = newPoint_xy(point, 0, par.h * 1.0);
			points.push(point)
			point = newPoint_xy(point, par.b * 1.0, 0);
			points.push(point)
		};
		var botLineP1 = points[points.length - 1]

		if (par.marshType == "пилообразный") {
			//Точки на нижней линии
			var botLine = parallel(points[0], points[2], -par.sectThk * 1.0);
			//		console.log(botLineP1, botLine)
			//верхняя точка
			var point = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), botLine.p1, botLine.p2);
			points.push(point)

			//нижняя точка
			var point = itercection(points[0], newPoint_xy(points[0], 100, 0), botLine.p1, botLine.p2);
			points.push(point)
		}

		if (par.marshType == "ломаный") {
			point = newPoint_xy(botLineP1, 0, -par.sectThk * 1.0);
			points.push(point)
			point = newPoint_xy(point, -(par.b - par.sectThk), 0);
			points.push(point)

			for (var i = 0; i < par.stairAmt - 2; i++) {
				point = newPoint_xy(point, 0, -par.h * 1.0);
				points.push(point)
				point = newPoint_xy(point, -par.b * 1.0, 0);
				points.push(point)
			};
			point = newPoint_xy(points[0], par.b * 1.0 + par.sectThk * 1.0, 0);
			points.push(point);
		}

		for (var i = 0; i < points.length; i++) {
			if (i < points.length - 1)
				addLine(shape, dxfPrimitivesArr, points[i], points[i + 1], par.dxfBasePoint);
			if (i == points.length - 1)
				addLine(shape, dxfPrimitivesArr, points[i], points[0], par.dxfBasePoint);
		};

		var extrudeOptions = {
			amount: par.M,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var marsh = new THREE.Mesh(geom, par.material);
		par.mesh.add(marsh)

		return par
	}

	static getMeta() {
		return {
			title: 'Лестница',
			inputs: [{
					key: 'h',
					title: 'Подъем',
					default: 180,
					type: 'number'
				},
				{
					key: 'b',
					title: 'Проступь',
					default: 260,
					type: 'number'
				},
				{
					key: 'stairAmt',
					title: 'Количество ступеней',
					default: 5,
					type: 'number'
				},
				{
					key: 'sectWidth',
					title: 'Ширина марша',
					default: 900,
					type: 'number'
				},
				{
					key: 'sectThk',
					title: 'Толщина секции',
					default: 200,
					type: 'number'
				},
				{
					key: 'marshType',
					title: 'Тип марша',
					default: 'пилообразный',
					values: [{
							value: 'пилообразный',
							title: 'Пилообразный'
						},
						{
							value: 'ломаный',
							title: 'Ломаный'
						}
					],
					type: 'select'
				}
			]
		}
	}
}