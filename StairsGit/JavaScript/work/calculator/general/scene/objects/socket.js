class Socket extends AdditionalObject {
	constructor(par) {
		super(par);

		var objPar = Object.assign({}, this.par)
		objPar.material = this.material;
		
		this.add(Socket.draw(objPar).mesh);
	}

	/** STATIC **/

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var p1 = { x: 0, y: 0 };
		var p2 = newPoint_xy(p1, 0, par.height);
		var p3 = newPoint_xy(p2, par.width, 0);
		var p4 = newPoint_xy(p3, 0, -par.height);

		//создаем шейп
		var shapePar = {
			points: [p1, p2, p3, p4],
			dxfArr: [],
			dxfBasePoint: { x: 0, y: 0 },
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var hole = new THREE.Path();
		var holePos = copyPoint({ x: par.width / 2, y: par.height / 2 });
		addCircle(hole, [], holePos, (par.width * 0.6) / 2, { x: 0, y: 0 })
		shape.holes.push(hole);

		var extrudeOptions = {
			amount: 10,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var socket = new THREE.Mesh(geom, par.material);
		socket.rotation.z += Math.PI / 2;
		socket.position.x += par.width;
		par.mesh.add(socket);

		return par
	}

	static getMeta() {
		return {
			title: 'Розетка',
			inputs: [
				{
					key: 'height',
					title: 'Высота',
					default: 70,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 70,
					type: 'number'
				}
			]
		}
	}
}