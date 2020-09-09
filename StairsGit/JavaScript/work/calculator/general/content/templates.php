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

<script id='sillDescriptionTempalte' type='text/html'>
	<div class='container sillDescr'>
		<div>
			<div class='text-center h2 mt-5'>Коммерческое предложение</div>
			<div class='text-center h3 mt-5'>Для {{:clientName}}</div>
			<div class='text-center h3 mt-5'>Красивые и удобные подоконники из натурального дерева по вашим размерам</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Используемые материалы</div>
			<div class='row'>
				{{for materials}}
					{{if #get("array").data.length > 1}}
						<div class="col-6 card-wrapper">
							<div class="card">
								<img class="card-img-top" src="{{:image}}" alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">{{:title}}</h5>
									<p class="card-text">{{:description}}</p>
								</div>
							</div>
						</div>
					{{else}}
						<div class='col-6'>
							<div class="h4 mt-2">{{:title}}</div>
							<div class="mt-3">{{:description}}</div>
						</div>
						<div class="col-6">
							<img class="card-img-top" src="{{:image}}" alt="">
						</div>
					{{/if}}
				{{/for}}
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Отделка дерева</div>
			<div class='mt-3'>За счет  специальной обработки - искусственного старения или брашировки,  красивая структура дерева дополнительно подчеркивается и становится более ярко выраженной. После этого изделие покрывается высококачественным маслом, немецкого производства. Масло надежно защищает древесину от гниения, благодаря глубокому проникновению в структуру. Не расслаивается и не отшелушивается. Масло абсолютно безвредно для человека.</div>
			<div class='row mt-4'>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/timber_work_1.jpg" alt=""></div>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/timber_work_2.jpg" alt=""></div>
			</div>
			<div>
				
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Покраска металла</div>
			<div class='mt-3'>В специальном покрасочном цехе мы окрашиваем все металлические детали долговечной износостойкой порошковой краской с нулевой эмиссией летучих веществ. А так же обеспечиваем контроль толщины слоя.</div>
			<div class='row mt-4'>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/metal_paint_1.jpg" alt=""></div>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/metal_paint_2.jpg" alt=""></div>
			</div>
			<div>
				
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Особенности конструкции</div>
			<div class='row mt-4'>
				{{for construction}}
					{{if #get("array").data.length > 1}}
						<div class="col-6 card-wrapper">
							<div class="card">
								<img class="card-img-top" src="{{:image}}" alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">{{:title}}</h5>
									<p class="card-text">{{:description}}</p>
								</div>
							</div>
						</div>
					{{else}}
						<div class='col-6'>
							<div class="h4 mt-2">{{:title}}</div>
							<div class="mt-3">{{:description}}</div>
						</div>
						<div class="col-6">
							<img class="card-img-top" src="{{:image}}" alt="">
						</div>
					{{/if}}
				{{/for}}
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Используемая технология - шаблонирование</div>
			<div class='mt-3'>Для того чтобы подоконник идеально вписался в проем, мы сперва изготавливаем шаблоны из фанеры по вашим размерам. После чего следует предварительная примерка и при необходимости, корректировка шаблонов. После того, как шаблоны идеально подходят по размерам, по ним изготавливается сам подоконник. В результате подоконник нужно будет подпиливать по месту и он встанет, как влитой.</div>
			<div class='row mt-4'>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/technology_1.png" alt=""></div>
				<div class="col-6" style='height: 300px; overflow:hidden'><img style='max-width: 100%;' src="/calculator/images/sill/technology_2.png" alt=""></div>
			</div>
			<div>
				
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Как будет происходить доставка и монтаж</div>
			<div class='row mt-4'>
				{{for assembling}}
					<div class="col-4">
						<div class='card-img'><img style='max-width: 100%;' src="{{:image}}" alt=""></div>
						<div>{{:text}}</div>
					</div>
				{{/for}}
			</div>
			<div>
				
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Как будет выглядеть весь процесс работы </div>
			<div class='row mt-4'>
				{{for work_process}}
					<div class="col-4">
						<div class='card-img'><img style='max-width: 100%;' src="{{:image}}" alt=""></div>
						<div>{{:text}}</div>
					</div>
				{{/for}}
			</div>
			<div>
				
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>Посмотрите работы, которые мы уже выполнили</div>
			<div class='row mt-4'>
				{{for examples}}
					<div class="col-3">
						<img class='gallery-img' src="{{:}}" alt="">
					</div>
				{{/for}}
			</div>
		</div>
		<div>
			<div class='text-center h3 mt-5'>На этом производстве мы будет делать ваш подоконник</div>
			<div class='row mt-4'>
				{{for factory}}
					<div class="col-3">
						<img class='gallery-img' src="{{:}}" alt="">
					</div>
				{{/for}}
			</div>
		</div>
	</div>
</script>

<script id="zamerBlocks" type="text/html">
	<div class="container zamer-blocks">
		<div class='description-title'>Так будет проходить замер вашей лестницы</div>
		<div class="row">
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6637-6665-4634-b739-323862643432/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Приедет специалист</b> в области проектирования и дизайна лестниц. Рассчитает удобную геометрию, подберет материалы.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6334-6636-4133-b362-343030616264/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Привезет с собой образцы</b> цветов и материалов.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild3965-3433-4338-b261-636237323266/_3D.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Сделает 3D модель</b> лестницы в специальной программе за 10-15 минут, рассчитает максимально удобную геометрию.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild3933-3231-4164-b536-613962653135/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Снимет необходимые размеры</b><br> для производства.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6233-3666-4062-a163-646361373330/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Рассчитает</b> несколько вариантов цены.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6331-6364-4262-b636-326638643666/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Даст рекомендации </b> для дальнейшего строительства дома и лестницы.</div>
				</div>
			</div>
		</div>
	</div>
</script>


<script id="zamerBlocksCarport" type="text/html">
	<div class="container zamer-blocks">
		<div class='description-title'>Так будет проходить замер вашего навеса</div>
		<div class="row">
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6637-6665-4634-b739-323862643432/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Приедет специалист</b> в области проектирования и дизайна навесов. Рассчитает удобную геометрию, подберет материалы.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6334-6636-4133-b362-343030616264/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Привезет с собой образцы</b> цветов и материалов.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild3965-3433-4338-b261-636237323266/_3D.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Сделает 3D модель</b> навеса в специальной программе за 10-15 минут, спроектирует навес под ваши размеры с конструкцией, подходящей под снеговые и ветровые нагрузки.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild3933-3231-4164-b536-613962653135/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Снимет необходимые размеры</b><br> для производства.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6233-3666-4062-a163-646361373330/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Рассчитает</b> несколько вариантов цены.</div>
				</div>
			</div>
			<div class="col-4 zamer-block">
				<div class="row">
					<div class='col-12'>
						<div style='max-width: 100px;'><img src="https://static.tildacdn.com/tild6331-6364-4262-b636-326638643666/photo.svg" alt=""></div>
					</div>
					<div class="col-12"><b>Даст рекомендации</b> по наилучшему расположению навеса, габаритам и углу наклона</div>
				</div>
			</div>
		</div>
	</div>
</script>