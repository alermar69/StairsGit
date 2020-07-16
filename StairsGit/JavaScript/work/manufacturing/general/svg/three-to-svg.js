/*
https://mt236.wordpress.com/2016/03/26/using-three-js-to-render-to-svg/
https://github.com/mrdoob/three.js/tree/master/examples/js/renderers
http://blog.felixbreuer.net/2014/08/05/using-threejs-to-create-vector-graphics-from-3d-visualizations.html
https://github.com/marciot/blog-demos/blob/master/three-to-svg/three-to-svg.js
http://0s.o53xo.nvqxey3jn52c4y3pnu.cmle.ru/blog-demos/three-to-svg/
*/

$(function(){
	$("#toSvg").click(function(){
		svgSnapshot();
		$("#svg").append('<button id="saveSvg">Сохранить SVG</button><button id="saveDxf">Сохранить DXF</button>');
	})
	
	$("#svg").delegate("#saveSvg", "click", function(){
		var text = $("#svg svg")[0].outerHTML;
		saveSvgFile(text);
	})
	
	$("#svg").delegate("#saveDxf", "click", function(){
		var text = $("#svg svg")[0].outerHTML;
		saveDxfFile(text);
	})

})

/** функция создает svg изображение из имеющейся сцены и камеры (берутся из глобальных переменных)
и выводит его на страницу в блок #svg
*/

function svgSnapshot() {
	var scene = view.scene
	var camera = view.camera;
	
	//формируем новую сцену чтобы туда попали только ребра объектов
	
	var scene_wf = new THREE.Scene();
	$.each(scene.children, function(){
		if(this.type == "Object3D"){
			var obj = this.clone();
			scene_wf.add(obj);
		}
	})
	
	/** функция удаляет из сцены все кроме LineSegments
	при этом структура вложенных объектов сохраняется чтобы сохранилась позиция
	*/
	
	function removeMeshes(obj){
		for(var i=0; i<obj.children.length; i++){
			var child = obj.children[i];
			
			if(child.type != "LineSegments" && child.type != "Object3D"){
				obj.children.splice(i, 1)
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


	$.each(scene_wf.children, function(){
		removeMeshes(this);
	})
	
	
	var width = 800
	var height = 600
	
	svgRenderer = new THREE.SVGRenderer();
	svgRenderer.setClearColor( 0xffffff );
	svgRenderer.setSize(width, height );
	svgRenderer.setQuality( 'high' );
	
	svgRenderer.render( scene_wf, camera );
	
	/* The following discussion shows how to scale an SVG to fit its contained
	 *
	 *  http://stackoverflow.com/questions/4737243/fit-svg-to-the-size-of-object-container
	 *
	 * Another useful primer is here
	 *  https://sarasoueidan.com/blog/svg-coordinate-systems/
	 */
	//var text = svgRenderer.domElement.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
	
	$("#svg").html(svgRenderer.domElement)
	$("#svg svg").attr({"xmlns": "http://www.w3.org/2000/svg"})
	
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

function saveDxfFile(text){

	var startPos = text.indexOf('d="') + 3;
	var endPos = text.indexOf('style="fill') - 2; 
	var commands = [];
	var dxfArr = [];
	var trashShape = new THREE.Shape();
	var dxfBasePoint = {x: 0, y: 0,}
	var curPoint = {x: 0, y: 0,}
	for(var i=startPos; i<endPos; i++){
		if(text[i] == "M" || text[i] == "L"){
			var command = {
				pos: i,
				name: text[i],
			}
			var j = i+1;
			
			while(text[j] != ","&& j < endPos){
				j++;
			}
			command.x = text.substring(i+1, j);
			i = j;
			
			while(text[j] != "M" && text[j] != "L" && j < endPos){
				j++;
			}
			command.y = text.substring(i+1, j);
			commands.push(command);
			i = j-1; //пропускаем параметры команды
			
			if(command.name == "M"){
				curPoint.x = command.x;
				curPoint.y = -command.y;
			} 
			
			if(command.name == "L"){
				addLine(trashShape, dxfArr, curPoint, {x: command.x, y: -command.y}, dxfBasePoint) //функция в файле drawPrimitives
			} 
			
		}
	}
	exportToDxf(dxfArr) //функция в файле dxfFileMaker.js
	
}

