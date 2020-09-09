$(function(){
	$("#showKnowledgePreviews").click(function(){
		getKnowledgeData('картинка', function(items){
			console.log(items);
			if (items.length > 0) {
				var images = [];
				items.forEach(function(item){
					var previews = item.previews;
					var regex = /src=\'(.*?)\'/;
					if ( regex.test(previews) ) {
						var iterator = 0;
						do {
							iterator++;
							regex.test(previews);
							images.push(RegExp.$1);
							previews = previews.replace(regex, '');
						} while (regex.test(previews) && iterator < 100);
					}
				});
				setServiceData('knowledge_previews', images);
				drawKnowledgePreviews();
			}else{
				alert('Примеры работ не найдены')
			}
		});
	});

	$("#showKnowledgeFiles").click(function(){
		getKnowledgeData(false, function(items){
			console.log(items);
			if (items.length > 0) {
				var files = [];
				items.forEach(function(item){
					if (items.type == "картинка" || !item.sort_condition) return;
					var filesHtml = item.files;
					var regex = /href=\'(.*?)\'/;
					if ( regex.test(filesHtml) ) {
						var iterator = 0;
						do {
							iterator++;
							regex.test(filesHtml);
							files.push({url: RegExp.$1, text: item.name});
							filesHtml = filesHtml.replace(regex, '');
						} while (regex.test(filesHtml) && iterator < 100);
					}
				});

				$("#knowledgeFiles").html("");
				files.forEach(function(file){
					var filename = file.url.split('/')
					$("#knowledgeFiles").append(`<div><a target="_blank" href="${file.url}">${file.text}(${filename[filename.length - 1]})</a></div>`);
				})
				if (window.updateDxfLinks) updateDxfLinks();
			}else{
				alert('Примеры работ не найдены')
			}
		});
	});

	$('body').on('click', '.knowledge-images-delete', function(){
		var src = $(this).attr('data-src');
		if (src && window.service_data) {
			var index = window.service_data.knowledge_previews.indexOf(src)
			window.service_data.knowledge_previews.splice(index, 1);
			drawKnowledgePreviews();
		}
	})

	$("#deleteAllKnowledgePreviews").click(function(){
		setServiceData('knowledge_previews', []);
		drawKnowledgePreviews();
	})
})


function drawKnowledgePreviews(){
	if (window.service_data.knowledge_previews) {
		$("#knowledgePreviews").html("");
		$("#knowledgePreviews").show();
		window.service_data.knowledge_previews.forEach(function(src){
			var html = `
				<div class='col-4 preview-wrapper'>
					<div class="description-images_image-delete" style='position: absolute; left: 35px; top: 35px;'>
						<button class="knowledge-images-delete btn btn-danger" data-src="${src}"><i class="fa fa-trash-o" title="Align Left"></i></button>
					</div>
					<a href='${src}' data-fancybox='knowledgeGallery' data-options='{\"buttons\": [\"rotate\", \"close\"]}'><img src='${src}' class='prv'></a>
				</div>
			`;
			$("#knowledgePreviews").append(html);
		})
	}
}

function getKnowledgeData(type, callback){
	var data = {};
	if (type) data.filterType = type;
	if (Object.keys(data).length > 0) {
		data['page'] = 'knowledge_base';
	}
	$.ajax({
		type: 'GET',
		url: '/orders/knowledge-controller/get-list',
		data: data,
		dataType: 'json',
		complete: function (data) {
			var items = data.responseJSON;
			if (items && items.length > 0) {
				var goodItems = items.filter(function(item){
					var goodItem = false;
					// if (item.type !== type) return false
					if (item.sort_condition && item.sort_condition != '') {
						try {
							if(eval(item.sort_condition)){
								goodItem = true
							}else{
								goodItem = false;
							}
						} catch (error) {
							goodItem = false;
						}
					}
					return goodItem;
				});
				callback(goodItems);
			}else{
				alert('Записи базы знаний не найдены');
				callback([]);
			}
		}
	});
}
