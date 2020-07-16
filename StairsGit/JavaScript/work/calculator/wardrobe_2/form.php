<style>
	.wardrobeForm{

	}

	.wardrobeForm input, .wardrobeForm select{
		border: 1px solid lightgray;
		width: 100%;
	}
</style>
<script id="wardrobeForm" type="text/template">
	<div class='wardrobeForm'>
		<table class="form_table" >
			<tbody>
				<tr>
					<td>
						Толщина стенок:
					</td>
					<td>
						<input type="number" name="dspThickness" data-link="wardrobe^dspThickness convertBack=~toNumber">
					</td>
				</tr>
			</tbody>
		</table>
		<button class='btn btn-success' data-link="{on ~root.addSection}">Добавить секцию</button>
		{^{for wardrobe.sections itemVar='~section'}}
			<h3>Секция #{^{:#index + 1}} <button class='btn btn-danger' data-link="{on ~root.removeSection ^{{:#index}}}"><i class='fa fa-trash'></i></button></h3>
			<table class="form_table" >
				<tbody>
					{{for ~root.inputs }}
						<tr>
							<td>
								{{: title}}:
							</td>
							<td>
								{{if type == 'number'}}
									<input type="number" name="{{:key}}" data-link="~section.meshParams^{{:key}} convertBack=~toNumber">
								{{else type == 'boolean'}}
									<input type="checkbox" name="{{:key}}" data-link="~section.meshParams^{{:key}}">
								{{else type == 'select'}}
									<select name="{{:key}}" data-link="~section.meshParams^{{:key}}">
										{{for values itemVar='~option' }}
											<option value="{{:~option.value}}">{{:~option.title}}</option>
										{{/for}}
									</select>
								{{/if}}
							</td>
						</tr>
					{{/for}}
					<tr>
						<td>
							Позиция:
						</td>
						<td>
							<div class="row">
								<div class="col-3">X:</div><div class="col-9"><input type="number" name="x" data-link="~section.position.x"></div>
								<div class="col-3">Y:</div><div class="col-9"><input type="number" name="y" data-link="~section.position.y"></div>
								<div class="col-3">Z:</div><div class="col-9"><input type="number" name="z" data-link="~section.position.z"></div>
								<div class="col-3">Поворот:</div><div class="col-9"><input type="number" name="rotation" data-link="~section.rotation"></div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		{{/for}}
	</div>
</script>

<div id='wardrobeFormContainer'></div>