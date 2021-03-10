$(function(){
	$(".createConstructionTask").click(function(){
		createConstructionTaskWrapper();
	})

	$('body').on('click', "#closeConstructionTask", function(){
		closeConstructionTask();
	})

	$('body').on('click', '.deleteGeomImage', function(){
		var parent = $(this).parent();
		parent.remove();
	});
})

function closeConstructionTask(){
	$('.construction_task_wrapper').remove();
	$('.main-content').show();
	$("#headerContainer").addClass('d-lg-block');
	$("#headerContainer").removeClass('noPrint');
	$("#headerContainer").show()
}

function createConstructionTaskWrapper(){
	getConstructionTaskHtml(function(html){
		$('.main-content').hide();
		$("#headerContainer").removeClass('d-lg-block');
		$("#headerContainer").addClass('noPrint');
		$("#headerContainer").hide()
		var body = '<div class="construction_task_wrapper" style="width: 1000px;">';
		body += html;
		body += '</div>';
		$('body').append(body);
	})
}

// Восстанавливает сцену после работы строительного задания
function fixSceneAfterConstructionTask(){
	if (view && view.scene) {
		view.scene.traverse(function(node){
			if (node.layerName) {
				node.visible = menu[node.layerName];
				if (node.layerName == 'topFloor' && node.material) {
					node.material.opacity = node.material.oldOpacity;
					node.material.color = node.material.oldColor;
				}
			}
		});
	
		drawSceneDimensions();
	}
}

function getConstructionTaskHtml(callback){
	if (typeof makeDrawings == 'undefined') {
		console.warn('файл drawDimensions не подключен!');
		return;
	}
	var avaliableLayers = [
		'treads','treads_wf', 'treadPlates',
		'dimensions','dimensions_wf',
		'carcas',
		'carcas_wf',
		'carcas1',
		'carcas1_wf',
		'roof',
		'racks',
		'purlins',
		'concrete',
		'topFloor_wf', 'topFloor'
	]
	if (params.calcType == 'railing') avaliableLayers.push('railing');

	var ignoreLayersCalcTypes = [
		'carport', 'veranda', 'objects'
	]
	if (view.scene) {
		view.scene.traverse(function(node){
			if (node.name.indexOf('Main-') == -1 && node.layerName && ignoreLayersCalcTypes.indexOf(params.calcType) == -1) {
				if (avaliableLayers.includes(node.layerName)) {
					node.visible = true;
					if (node.layerName == 'topFloor' && node.material) {
						node.material.oldOpacity = node.material.opacity;
						node.material.opacity = 0.0;
						node.material.oldColor = node.material.color;
						node.material.color = new THREE.Color(0.4,0.4,0.4);
					}
					if (node.layerName == 'topFloor_wf') {
						node.material = node.material.clone();
						node.material.color = new THREE.Color(0,0,0);
						node.material.lineWidth = 5;
					}
				}else{
					console.log(node.layerName)
					node.visible = false;
				}
			}
		});
	}

	if (params.calcType != 'fire_2') {
		makeDrawings(function(html){
			var drawings = $("#geomDrawings").html();
			createConstructionTask(drawings, callback)
		}, {hideTreadDimensions: true, imageWidth: "600px"});
	}else{
		createConstructionTask('<img src="' + $('#mainView')[0].toDataURL() + '">');
	}
}

function createConstructionTask(drawings, callback){
	// construction_task
	if(!drawings) drawings = "";
	var images = getPreviewImages('construction_task');
	var template = $.templates("#constructionTaskImagesTemplate");
	drawings += '<div id="construction_task_previews">' + template.render({images: images}) + '</div>';

	// images.forEach(function(img){drawings += '<img style="width: 100%; height: auto;" src="'+img.url+'" alt="Foto">';});

	var title = "Строительное задание.";
	if ($('#orderName').val()) title += " <h3 style='text-align: center'>Приложение к договору № " + $('#orderName').val() + "</h3>";

	var text = "<h2>Размеры обстановки</h2>\
		<div contenteditable>\
		<p>Для беспрепятственной установки лестницы необходимо выдержать следующие основные размеры обстановки:</p>"
	
	text += "1. Лестница устанавливается на " + params.botFloorType + " пол. Высота от чистового пола нижнего этажа \
		до чистового пола верхнего этажа: " + params.staircaseHeight + "мм <br/>";
	if(params.botFloorType == "черновой") text += "Расстояние от чернового до чистового пола нижнего этажа " + params.floorOffsetBot + "мм<br/><br/>"
	
	text += "2. Размеры проема в верхнем перекрытии с учетом облицовки " + params.floorHoleWidth + "х" + params.floorHoleLength + "мм. \
		Полная толщина верхнего перекрытия с учетом отделки " + params.floorThickness + "мм <br>\
	</div>"
	

	
	text += "<div><h2>Основные размеры лестницы</h2>" + drawings + "</div>";
	
	text += "<h2>Дополнительные требования к месту установки</h2>\
	<div contenteditable>\
	1. В непосредственной близости от места установки Изделия должна быть подготовлена ровная, чистая и сухая площадка размерами не менее 4х2м для складирования элементов изделия. <br>\
	<br>\
	2. К месту установки необходимо подвести электричество (220 В, 3кВт) для подключения инструмента и освещения;<br>\
	<br>\
	3. Общестроительные работы в зоне установки Изделия должны быть завершены или приостановлены на время сборки и установки;<br>\
	<br>\
	4. В местах крепления Изделия к стенам и перекрытиям не должно быть скрытых коммуникаций, теплых полов, прочих инженерных систем. Подрядчик не несет ответственности за повреждение скрытых коммуникаций.<br>\
	<br>\
	5. До начала монтажных работ необходимо демонтировать все ранее смонтированные и временные конструкции, которые создают помехи для проведения работ Подрядчиком<br>\
	<br>\
	6.Перекрытия и стены, к которым планируется закреплять несущие элементы лестницы, должны обладать достаточной прочностью, чтобы выдержать нагрузку от установки анкерных элементов и веса площадок или прочих лестничных элементов;<br>\
	<br>\
	7.На время установки каркаса лестницы, полы, потолки, стены, фасадные или архитектурные элементы, а также окна и двери, которые имеют финишную или чистовую отделку, должны быть укрыты соответствующим материалом для предотвращения их возможного повреждения при проведении Работ. Подрядчик не несет ответственности за повреждения незакрытых элементов.<br>\
	<br>\
	</div>\
	<div id='contractFooter'>\
		<table><tbody>\
			<tr contenteditable><td>Продавец</td><td>Покупатель</td></tr>\
			<tr>\
				<td>\
					<div class='signPlace'></div>\
				</td>\
				<td>\
					<div class='signPlace'></div>\
				</td>\
			</tr>\
		</tbody></table>\
	</div>";
		

	var docHeader = "<!DOCTYPE html><html><head><title></title><link rel='stylesheet' type='text/css' href='/calculator/general/content/construction_task.css'><link rel='stylesheet' type='text/css' href='/calculator/general/content/styles.css'></head><body><div class='documentDiv'><h1 style='text-align: center;' contenteditable>" + title + "</h1>";
	var docFooter = "</body></html>"
	var printControls = "\
		<button class='btn btn-primary noPrint' onclick='this.style.display=\"none\";window.print()'>Печать</button>\
		<button class='btn btn-danger noPrint' id='closeConstructionTask'>Закрыть</button>\
	";
	var html = "";
	html += printControls;
	html += docHeader;
	html += text;
	html += docFooter;
	if (callback) callback(html);

	fixSceneAfterConstructionTask();
}