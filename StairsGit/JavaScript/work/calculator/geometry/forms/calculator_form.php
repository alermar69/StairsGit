<div id='geometry_form' class='noPrint'>
	<h4>Рассчет геометрии</h4>
	
	<table class='form_table'>
		<tbody>
			<tr>
				<td>Минимальный габарит G_min, мм</td>
				<td><input id="G_min" type="number" value="2100"></td>
			</tr>
			<tr>
				<td>Зазор до стен, мм:</td>
				<td><input id="wallDist" type="number" value="10"></td>
			</tr>
			
			<tr>
				<td>Тип установки верхней ступени:</td>
				<td> 
					<select id="topStairType" size="1" >
						<option value="ниже">ниже перекрытия</option>
						<option value="вровень">вровень с перекрытием</option>		
					</select>
				</td>
			</tr>
		
			<tr>
				<td>Угол наклона лестницы</td>
				<td>
					<select id="angleType" size="1" onchange="">
						<option value="расчетные">расчетные</option>
						<option value="задаются" >задаются</option>				
					</select>
				</td>
			</tr>
			
			<tr id='threeMarshsTr'>
				<td>Второй марш заходит под проем?</td>
				<td>
					<select id="gCalcType" size="1" onchange="">
						<option value="первый марш">Нет</option>
						<option value="второй марш">Да</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<button id='calcGeometry'>Рассчитать геомерию</button>

	<h4>Модификация геометрии</h4>
	
	<div id='calculatorGeometryForm'>
		<div>
			Операция: 
			<select id='geomModifyMode'>
				<option value="addStep">Добавить ступень в марше</option>
				<option value="removeStep">Убрать ступень в марше</option>
				<option value="setMarshLen">Задать длину проекции нижнего марша</option>
				<option value="setStaircaseWidth">Вписать лестницу в проем по ширине</option>
				<option value="setStepHeight">Выровнять подъем ступени</option>
			</select>
		</div>
		
		<div>
			Марш: 
			<select id='geomModifyMarshId'>
				<option value="1">нижний</option>
				<option value="2">средний</option>
				<option value="3">верхний</option>
			</select>
		</div>

				
		<div>
			Длинна марша: 
			<input type="number" id='firstMarshLen'>
		</div>
		
		<button id='modifyGeom'>Применить</button>
	
	</div>
	
	<div id='rezultat'></div>

</div>

<style>
	#geometry_form .h1{
		all: unset;
	}
	.highlight{
		background-color: #aaffb9;
	}

	#geometryNotice{
		border-bottom: 4px solid #aaffb9;
		margin: 10px;
		width: fit-content;
	}
</style>