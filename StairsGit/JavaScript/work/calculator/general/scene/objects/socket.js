<<<<<<< HEAD
class Socket extends AdditionalObject{
	constructor(par){
		super(par);

		var p1 = {x:0,y:0};
		var p2 = newPoint_xy(p1, 0, this.par.height);
		var p3 = newPoint_xy(p2, this.par.width, 0);
		var p4 = newPoint_xy(p3, 0, -this.par.height);

		//создаем шейп
		var shapePar = {
			points: [p1,p2,p3,p4],
			dxfArr: [],
			dxfBasePoint: {x: 0, y: 0},
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var hole = new THREE.Path();
		var holePos = copyPoint({x: this.par.width / 2, y: this.par.height / 2});
		addCircle(hole, [], holePos, (this.par.width * 0.6) / 2, {x:0,y:0})
		shape.holes.push(hole);

		var extrudeOptions = {
			amount: 10,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var socket = new THREE.Mesh(geom, this.material);
		socket.rotation.z += Math.PI / 2;
		socket.position.x += this.par.width;
		this.add(socket);
	}

	/** STATIC **/
	static getMeta(){
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
=======
class Socket extends AdditionalObject{
	constructor(par){
		super(par);

		var p1 = {x:0,y:0};
		var p2 = newPoint_xy(p1, 0, this.par.height);
		var p3 = newPoint_xy(p2, this.par.width, 0);
		var p4 = newPoint_xy(p3, 0, -this.par.height);

		//создаем шейп
		var shapePar = {
			points: [p1,p2,p3,p4],
			dxfArr: [],
			dxfBasePoint: {x: 0, y: 0},
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var hole = new THREE.Path();
		var holePos = copyPoint({x: this.par.width / 2, y: this.par.height / 2});
		addCircle(hole, [], holePos, (this.par.width * 0.6) / 2, {x:0,y:0})
		shape.holes.push(hole);

		var extrudeOptions = {
			amount: 10,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var socket = new THREE.Mesh(geom, this.material);
		socket.rotation.z += Math.PI / 2;
		socket.position.x += this.par.width;
		this.add(socket);
	}

	/** STATIC **/
	static getMeta(){
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
>>>>>>> curve
}