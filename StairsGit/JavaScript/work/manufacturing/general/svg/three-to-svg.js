/*
https://mt236.wordpress.com/2016/03/26/using-three-js-to-render-to-svg/
https://github.com/mrdoob/three.js/tree/master/examples/js/renderers
http://blog.felixbreuer.net/2014/08/05/using-threejs-to-create-vector-graphics-from-3d-visualizations.html
https://github.com/marciot/blog-demos/blob/master/three-to-svg/three-to-svg.js
http://0s.o53xo.nvqxey3jn52c4y3pnu.cmle.ru/blog-demos/three-to-svg/
*/

$(function(){
	$('#makeSnapshot').click(function(){
		$('#snapshotModal').modal('show');
	})
	$("#makeSVGFromViewport").click(function(){
		$('#snapshotModal').modal('hide');
		var viewType = $('#snapshotModal .svgViewType').val()
		$('#svg').show();
		svgSnapshot(viewType);
	})
	
	$("#svg").delegate("#saveSvg", "click", function(){
		var text = $("#svg svg")[0].outerHTML;
		saveSvgFile(text);
	})
	
	$("#svg").delegate("#saveDxf", "click", function(){
		setTimeout(() => {
			var paths = $("#svg svg path");
			saveDxfFile(paths);
		}, 1000);
	})

})

/** функция создает svg изображение из имеющейся сцены и камеры (берутся из глобальных переменных)
и выводит его на страницу в блок #svg
*/

function svgSnapshot(viewType) {
	/** функция удаляет из сцены все кроме LineSegments
	при этом структура вложенных объектов сохраняется чтобы сохранилась позиция
	*/
	function removeMeshes(obj){
		for(var i=0; i<obj.children.length; i++){
			var child = obj.children[i];
			
			if(child.type != "LineSegments" && child.type != "Object3D" || child.visible == false ){
				obj.children.splice(i, 1)
				// if(child.material) child.material.color = new THREE.Color(255,255,255)
				i--;
			}
			if(child.type == "Object3D") removeMeshes(child);
			if(child.type == "LineSegments") {
				child.material.color.r = 0;
				child.material.color.g = 0;
				child.material.color.b = 0;
				child.material.linewidth = 1;
			}
		}
	}
	
	menu.perspective = false;

	view.width = 1000;
	view.height = 1000;
	view.renderer.setSize( view.width, view.height );
	switchCamera(viewType);
	view.camera.aspect = 1;
	view.camera.zoom = 0.5;
	view.camera.updateProjectionMatrix();
	// Ожидаем смены камеры
	setTimeout(function(){
		//формируем новую сцену чтобы туда попали только ребра объектов
		removeObjects('vl_1', 'measure');
		removeObjects('vl_1', 'dimensions');

		window.scene_wf = view.scene.clone();

		// $.each(view.scene.children, function(){
		// 	if(this instanceof THREE.Object3D){
		// 		try {
		// 			var obj = this.clone();
		// 			scene_wf.add(obj);
		// 		} catch (error) {
		// 			console.log('ignore broken object')
		// 		}
		// 	}
		// })

		$.each(scene_wf.children, function(){
			removeMeshes(this);
		})

		window.svgRenderer = new THREE.SVGRenderer();
		svgRenderer.setClearColor( 0xffffff );
		svgRenderer.setSize(1000, 1000 );
		svgRenderer.setQuality( 'high' );
		
		svgRenderer.render( scene_wf, view.camera );
		setTimeout(() => {
			$("#svg .image_container").html(svgRenderer.domElement)
			$("#svg svg").attr({"xmlns": "http://www.w3.org/2000/svg"});
			window.panZoomSvgPreview = svgPanZoom('#svg svg', {
				zoomScaleSensitivity: 0.5,
				minZoom: 0.5,
				maxZoom: 100,
			});
		}, 0);
	
	}, 1000);
}

/** функция создает файл svg на основе текста svg
*/

function saveSvgFile(text) {	
	var byteCharacters = unicodeToWin1251_UrlEncoded(text);
	var byteArray = new Uint8Array(byteCharacters);
	 
	var BB = window.Blob;
	var fileName = "draw.svg";
	saveAs(
		new BB([byteArray], {type: "image/png"}), 
		fileName
	);
}

/** функция конвертирует текст svg в dxf и создает файл
работает только с автоматически сгенерированными SVGRenderer файлами svg, где в path есть только команды
L (line) и M(moove)
*/

function saveDxfFile(data){
	initMakerJs(function(){
		var models = {};
		$.each(data, function(i){
			var d = $(this).attr('d');
			// var parts = Raphael.parsePathString(d);
			// console.log(parts);
			if (d) {
				console.log(i);
				models[i] = makerjs.importer.fromSVGPathData(d);
				models[i].layer = $(this).attr('data-layer');
				makerjs.model.scale(models[i], 16);
			}
		})
		var dxf = makerjs.exporter.toDXF({models: models});
		
		var byteCharacters = unicodeToWin1251_UrlEncoded(dxf);
		var byteArray = new Uint8Array(byteCharacters);
		
		var BB = window.Blob;
		var fileName = "draw.dxf";
		saveAs(
			new BB([byteArray], {type: "application/octet-stream"}), 
			fileName
		);
	})
}

function initMakerJs(callback){
	if (!window.makerjs) {
		$.getScript('/calculator/general/libs/browser.maker.js', function(){
			window.makerjs = require('makerjs');
			callback();
		})
	}else{
		callback();
	}
}
