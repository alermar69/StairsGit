<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики изделия</h2>
	<div id="carcasForm" class="toggleDiv">
	
	<h4>1. Обстановка:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Место установки:</td> <td> 
				<select id="geom" size="1">
					<option value="стена">стена</option>
					<option value="угол">угол</option>
					<option value="эркер">эркер</option>
					<option value="балконное окно">балконное окно</option>
					<option value="подоконный блок">подоконный блок</option>
				</select>
			</td></tr>
			
			<tr><td>Сторона:</td> <td> 
				<select id="geomSide" size="1">
					<option value="правая">правая</option>
					<option value="левая">левая</option>
				</select>
			</td></tr>
			

			<tr>
				<td>Ширина окна:</td> 
				<td><input id="windowWidth" type="number" value="1000"></td>
			</tr>
			
			<tr>
				<td>Высота окна:</td> 
				<td><input id="windowHeight" type="number" value="1600"></td>
			</tr>
			
			<tr>
				<td>Скос откоса:</td> 
				<td><input id="wallSideBevel" type="number" value="50"></td>
			</tr>
			
			<tr>
				<td>Высота потолка:</td> 
				<td><input id="ceilHeight" type="number" value="2800"></td>
			</tr>
			
			
			<tr>
				<td>Толщина стены:</td> 
				<td><input id="wallThk" type="number" value="400"></td>
			</tr>
			
			<tr>
				<td>Позиция окна по глубине:</td> 
				<td><input id="windowPosZ" type="number" value="200"></td>
			</tr>
			
			<tr>
				<td>Отступ окна от угла:</td> 
				<td><input id="windowOffset" type="number" value="200"></td>
			</tr>
			
			<tr>
				<td>Кол-во створок окна:</td> 
				<td><input id="windowSectAmt" type="number" value="1"></td>
			</tr>
			
			<tr>
				<td>Высота от пола:</td> 
				<td><input id="height" type="number" value="800"></td>
			</tr>
			
		
		</tbody><table>
		
		<h4>1. Подоконник:</h4>

		<table class="form_table" id="sillPar"><tbody>

			<tr><td>Тип:</td> <td> 
				<select id="countertopModel" size="1">
					<option value="цельная">цельная</option>
					<option value="двойная">двойная</option>
					<option value="двойная с вставкой">двойная с вставкой</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr><td>Передний край:</td> <td> 
				<select id="frontEdge" size="1">
					<option value="прямой">прямой</option>
					<option value="живой">живой</option>
				</select>
			</td></tr>
			
			<tr>
				<td>Толщина:</td> 
				<td><input id="sillThk" type="number" value="40"></td>
			</tr>
			
			<tr>
				<td>Свес спереди:</td> 
				<td><input id="frontNose" type="number" value="100"></td>
			</tr>
			
			<tr>
				<td>Свес справа:</td> 
				<td><input id="rightNose" type="number" value="50"></td>
			</tr>
			
			<tr>
				<td>Свес слева:</td> 
				<td><input id="leftNose" type="number" value="50"></td>
			</tr>

			<tr>
				<td>Радиус справа:</td> 
				<td><input id="cornerRadRight" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Радиус слева:</td> 
				<td><input id="cornerRadLeft" type="number" value="20"></td>
			</tr>
			
		
		</tbody></table>
		
		<h4>2. Подстолье:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Модель:</td> <td> 
				<select id="baseModel">
					<option value="не указано">не указано</option>
					<option value="D-1">D-1</option>
					<option value="S-1">S-1</option>
					<option value="S-2">S-2</option>
					<option value="S-3">S-3</option>
					<option value="S-4">S-4</option>
					<option value="S-5">S-5</option>
					<option value="S-6">S-6</option>
					<option value="S-7">S-7</option>
					<option value="S-8">S-8</option>
					<option value="S-9">S-9</option>
					<option value="T-1" selected>T-1</option>
					<option value="T-2">T-2</option>
					<option value="T-3">T-3</option>
					<option value="T-4">T-4</option>
					<option value="T-5">T-5</option>
					<option value="T-6">T-6</option>
					<option value="T-7">T-7</option>
					<option value="T-8">T-8</option>
					<option value="T-9">T-9</option>
					<option value="T-10">T-10</option>
					<option value="T-11">T-11</option>
					<option value="T-12">T-12</option>
					<option value="T-13">T-13</option>
					<option value="T-14">T-14</option>
					<option value="T-15">T-15</option>
					<option value="T-16">T-16</option>
					<option value="T-17">T-17</option>
					<option value="T-18">T-18</option>
				</select>
				<button class="showModal noPrint" data-modal="sideModal">эскизы</button>
			</td></tr>
			

			

		</tbody></table>
	</div>
</div>
		
<!--Обработчик формы-->
<script type="text/javascript" src="forms/mainFormChange.js"></script>


