<link rel="stylesheet" href="/calculator/general/content/templates.css">

<script id="previewsTemplate" type="text/x-jsrender">
	<div class='description_image-button'>
		<button class="btn btn-primary add_description_image" data-type="preview">Добавить картинку</button>
	</div>
	<div class="row">
		{{for images}}
			<div class="col-4" style='margin-top: 10px;'>
				<div class="description-images_image-delete">
					<button class="delete_description_image btn btn-danger" data-image_id="{{:id}}"><i class="fa fa-trash-o" title="Align Left"></i></button>
				</div>
				<a href="{{:url}}" style='margin: auto;' data-fancybox="previews"> <img style='width: 100%; height: auto;' src="{{:url}}" alt="Foto"> </a>
			</div>
		{{/for}}
	</div>
</script>

<script id="geometryFactsTemplate" type="text/x-jsrender">
	<div class='description-block'>
		<div class='container'>
			<div class="descripton-content row">
				<div class="descripton-content_image col-lg-3 col-md-3 col-sm-3 col-xs-3">
					<img style="max-height: 200px;" src="{{:image}}" alt="">
				</div>
				<div class="descripton-content_text col-lg-9 col-md-9 col-sm-9 col-xs-9">
					<h3>{{: name }}</h3>
					<div class='description-main description-main--fact'>{{: description ? description : name }}</div>
				</div>
			</div>
		</div>
	</div>
</script>

<script id="descriptionTempalte" type="text/x-jsrender">
	<div class='description-block'>
		<div class='container'>
			<div class="descripton-content row">
				<div class="descripton-content_image col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div class="description-images" data-images_type="{{:type}}">
						{{for images}}
							<div class='description-images_image'>
								<div class="description-images_image-delete">
									<button class="delete_description_image btn btn-danger" data-image_id="{{:id}}"><i class="fa fa-trash-o" title="Align Left"></i></button>
								</div>
								<a href='{{:url}}' data-fancybox='gallery'><img src='{{:url}}'></a>
								<!-- <img src="{{:url}}" alt=""> -->
							</div>
						{{else}}
							<div class='description-images_image'>
								<img src="/calculator/images/description/{{:type}}.jpg" alt="">
							</div>
						{{/for}}
					</div>
					<div class='description_image-button'>
						<button class="btn btn-primary add_description_image" data-type="{{:type}}">Добавить картинку</button>
					</div>
				</div>
				<div class="descripton-content_text col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div class='description-title'>{{: content.title}}</div>
					<div class='description-main'>{{: content.main}}</div>
					<div class='description-facts'>
						<ul>
							{{for content.facts}}
								<li>{{:}}</li>
							{{/for}}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>