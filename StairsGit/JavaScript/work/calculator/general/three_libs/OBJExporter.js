/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJExporter = function () {};

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	parse: function ( object, filename ) {

	var output = '';
		var materials = {};

		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

	output += 'mtllib ' + filename +  '.mtl\n';

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbVertexUvs = 0;
			var nbNormals = 0;

			var geometry = mesh.geometry;
			var material = mesh.material;

			if ( geometry instanceof THREE.Geometry ) {
				var meshName = mesh.name
				if(!meshName) meshName = mesh.uuid
				output += 'o ' + meshName + '\n';

				var vertices = geometry.vertices;

				for ( var i = 0, l = vertices.length; i < l; i ++ ) {

					var vertex = vertices[ i ].clone();
					vertex.applyMatrix4( mesh.matrixWorld );

					output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					nbVertex ++;

				}

				// uvs

				var faces = geometry.faces;
				var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
				var hasVertexUvs = faces.length === faceVertexUvs.length;

				if ( hasVertexUvs ) {

					for ( var i = 0, l = faceVertexUvs.length; i < l; i ++ ) {

						var vertexUvs = faceVertexUvs[ i ];

						for ( var j = 0, jl = vertexUvs.length; j < jl; j ++ ) {

							var uv = vertexUvs[ j ];

							output += 'vt ' + uv.x + ' ' + uv.y + '\n';

							nbVertexUvs ++;

						}

					}

				}

				// normals

				var normalMatrixWorld = new THREE.Matrix3();
				normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

				for ( var i = 0, l = faces.length; i < l; i ++ ) {

					var face = faces[ i ];
					var vertexNormals = face.vertexNormals;

					if ( vertexNormals.length === 3 ) {

						for ( var j = 0, jl = vertexNormals.length; j < jl; j ++ ) {

							var normal = vertexNormals[ j ].clone();
							normal.applyMatrix3( normalMatrixWorld );

							output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

							nbNormals ++;

						}

					} else {

						var normal = face.normal.clone();
						normal.applyMatrix3( normalMatrixWorld );

						for ( var j = 0; j < 3; j ++ ) {

							output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

							nbNormals ++;

						}

					}

				}

			// material

			if (material.name !== '')
				output += 'usemtl ' + material.name + '\n';
			else
				output += 'usemtl material' + material.id + '\n';

			materials[material.id] = material;

				// faces


				for ( var i = 0, j = 1, l = faces.length; i < l; i ++, j += 3 ) {

					var face = faces[ i ];

					output += 'f ';
					output += ( indexVertex + face.a + 1 ) + '/' + ( hasVertexUvs ? ( indexVertexUvs + j     ) : '' ) + '/' + ( indexNormals + j     ) + ' ';
					output += ( indexVertex + face.b + 1 ) + '/' + ( hasVertexUvs ? ( indexVertexUvs + j + 1 ) : '' ) + '/' + ( indexNormals + j + 1 ) + ' ';
					output += ( indexVertex + face.c + 1 ) + '/' + ( hasVertexUvs ? ( indexVertexUvs + j + 2 ) : '' ) + '/' + ( indexNormals + j + 2 ) + '\n';

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseMesh(): geometry type unsupported', mesh );
				// TODO: Support only BufferGeometry and use use setFromObject()

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
			indexNormals += nbNormals;

		};

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) parseMesh( child );

		} );

	// mtl output

	var mtlOutput = '';
	var images = [];

	for (var key in materials) {

		var mat = materials[key];

		if (mat.name !== '')
			mtlOutput += 'newmtl ' + mat.name + '\n';
		else
			mtlOutput += 'newmtl material' + mat.id + '\n';

		mtlOutput += 'Ns 10.0000\n';
		mtlOutput += 'Ni 1.5000\n';
		mtlOutput += 'd 1.0000\n';
		mtlOutput += 'Tr 0.0000\n';
		mtlOutput += 'Tf 1.0000 1.0000 1.0000\n';
		mtlOutput += 'illum 2\n';
		mtlOutput += 'Ka ' + mat.color.r + ' ' + mat.color.g + ' ' + mat.color.b + ' ' + '\n';
		mtlOutput += 'Kd ' + mat.color.r + ' ' + mat.color.g + ' ' + mat.color.b + ' ' + '\n';
		mtlOutput += 'Ks 0.0000 0.0000 0.0000\n';
		mtlOutput += 'Ke 0.0000 0.0000 0.0000\n';

		if (mat.map && mat.map instanceof THREE.Texture && mat.map.image.currentSrc) {

			var file = mat.map.image.currentSrc.slice( mat.map.image.currentSrc.lastIndexOf("/"), mat.map.image.currentSrc.length);
			mtlOutput += 'map_Ka ' + file + '\n';
			mtlOutput += 'map_Kd ' + file + '\n';
			if(images.indexOf(mat.map.image.currentSrc) == -1){
				images.push(mat.map.image.currentSrc)
			}
		}

	}

	return {
		obj: output,
		mtl: mtlOutput,
		images: images,
	}

	}

};



function exportToObj(scene) {
	//saveSTL( $[viewportId], "aa111" );
	//saveOBJ( sc, "aa111" );

	var filename = "scene";
	if(params.orderName) filename = params.orderName;

	// Use FileSaver.js 'saveAs' function to save the string
	var exporter = new THREE.OBJExporter();
	var expObj = exporter.parse( scene, filename );
	var objString = expObj.obj;
	var mtlString = expObj.mtl;
	var blob = new Blob([objString], {type: 'text/plain'});
	saveAs(blob, filename + '.obj');
	var blob = new Blob([mtlString], {type: 'text/plain'});
	saveAs(blob, filename + '.mtl');
	
	//картинки текстур
	expObj.images.forEach(function(item, i) {
		console.log( i + ": " + item );

		var link = document.createElement('a');
		link.setAttribute('href', item);
		link.setAttribute('download', '');
		onload=link.click();
	});
}
