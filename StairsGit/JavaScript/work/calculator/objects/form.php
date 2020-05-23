
<script id="objectsFormTemplate" type="text/template">
	<div class=''>
		<button class='btn btn-success' data-link="{on ~root.addObject}">Добавить объект</button>
		{^{for objects itemVar='~object'}}
			<h3>Объект #{^{:#index + 1}} <button class='btn btn-danger' data-link="{on ~root.removeObject ^{{:#index}}}"><i class='fa fa-trash'></i></button></h3>
			<table class="form_table" >
				<tbody>
					{{for ~root.inputs }}
						<tr>
							<td>
								{{: title}}:
							</td>
							<td>
								{{if type == 'number'}}
									<input type="number" name="{{:key}}" data-link="~object.meshParams^{{:key}} convertBack=~toNumber">
								{{else type == 'boolean'}}
									<input type="checkbox" name="{{:key}}" data-link="~object.meshParams^{{:key}}">
								{{else type == 'select'}}
									<select name="{{:key}}" data-link="~object.meshParams^{{:key}}">
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
								<div class="col-3">X:</div><div class="col-9"><input type="number" name="x" data-link="~object.position.x"></div>
								<div class="col-3">Y:</div><div class="col-9"><input type="number" name="y" data-link="~object.position.y"></div>
								<div class="col-3">Z:</div><div class="col-9"><input type="number" name="z" data-link="~object.position.z"></div>
								<div class="col-3">Поворот:</div><div class="col-9"><input type="number" name="rotation" data-link="~object.rotation"></div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		{{/for}}
	</div>
</script>

<div id='objectsFormContainer'></div>