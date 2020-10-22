<div class="noPrint">
	<button id="openDoors" class="noPrint">Открыть дверки</button>
	<button id="fixDoors" class="noPrint">Заблокировать двери</button>
</div>

<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики изделия</h2>
	<div id="carcasForm" class="toggleDiv">

		<h4>1. Общие характеристики:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Коллекция:</td> <td> 
				<select id="model" size="1">
					<option value="Сканди">Сканди</option>
					<option value="Брутал">Брутал</option>
				</select>
			</td></tr>


			<tr>
				<td>Ширина:</td> 
				<td><input id="width" type="number" value="1000"></td>
			</tr>

			<tr>
				<td>Высота:</td> 
				<td><input id="height" type="number" value="900"></td>
			</tr>

			<tr>
				<td>Глубина:</td> 
				<td><input id="depth" type="number" value="500"></td>
			</tr>
			<tr>
				<td>Кол-во секций:</td> 
				<td>
					<select id="sectAmt" size="1">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
					</select>
				</td>
			</tr>



			</tbody> </table>


			<h4>2. Секции:</h4>
			<input id="sectAmt_wr" type="number" value="1" style="display: none;">

			<table class="form_table" id="sectParamsTable" ><tbody>
				<tr>
					<th>№</th>
					<th>Петли:</th>
					<th>Ширина:</th>
				</tr>
				
				<tr class="sectTr"> 
					<td class="sectNumber">1</td> 
					<td>
						<select class="hingeSide" id="hingeSide0" size="1">
							<option value="справа">справа</option>
							<option value="слева">слева</option>
							<option value="две стороны">две стороны</option>
							<option value="нет">нет</option>
						</select>
					</td>
					<td><input class="sectWidth" id="sectWidth0" type="number" value="900" step="5"></td>
				</tr>
				<tr class="sectTr"> 
					<td class="sectNumber">2</td> 
					<td>
						<select class="hingeSide" id="hingeSide1" size="1">
							<option value="справа">справа</option>
							<option value="слева">слева</option>
							<option value="две стороны">две стороны</option>
							<option value="нет">нет</option>
						</select>
					</td>
					<td><input class="sectWidth" id="sectWidth1" type="number" value="900" step="5"></td>
				</tr>
				<tr class="sectTr"> 
					<td class="sectNumber">3</td> 
					<td>
						<select class="hingeSide" id="hingeSide2" size="1">
							<option value="справа">справа</option>
							<option value="слева">слева</option>
							<option value="две стороны">две стороны</option>
							<option value="нет">нет</option>
						</select>
					</td>
					<td><input class="sectWidth" id="sectWidth2" type="number" value="900" step="5"></td>
				</tr>
				<tr class="sectTr"> 
					<td class="sectNumber">4</td> 
					<td>
						<select class="hingeSide" id="hingeSide3" size="1">
							<option value="справа">справа</option>
							<option value="слева">слева</option>
							<option value="две стороны">две стороны</option>
							<option value="нет">нет</option>
						</select>
					</td>
					<td><input class="sectWidth" id="sectWidth3" type="number" value="900" step="5"></td>
				</tr>

			</tbody> </table>

			<button id="equalSectWidth" class="noPrint">Выровнять ширину</button>




			<div class="sectRowsParams" data-sectId="0">
				<h4>2.1 Ряды секции №1:</h4>
				<input id="rowAmt0" type="number" value="0" style="display: none;">
				<table class="form_table" id="boxParamsTable0"><tbody>
					<tr>
						<th>№</th>
						<th>Высота</th>
						<th>Тип</th>
						<th>Удалить</th>
					</tr>
				</tbody> </table>
				
				<button class="addRow noPrint">Добавить ряд</button>
				<button class="setEqualRowHeight noPrint">Выровнять высоту</button>
			</div>

			<div class="sectRowsParams" data-sectId="1">
				<h4>2.2 Ряды секции №2:</h4>
				<input id="rowAmt1" type="number" value="0" style="display: none;">
				<table class="form_table" id="boxParamsTable1"><tbody>
					<tr>
						<th>№</th>
						<th>Высота</th>
						<th>Тип</th>
						<th>Удалить</th>
					</tr>
				</tbody> </table>
				
				<button class="addRow noPrint">Добавить ряд</button>
				<button class="setEqualRowHeight noPrint">Выровнять высоту</button>
			</div>

			<div class="sectRowsParams" data-sectId="2"> 
				<h4>2.3 Ряды секции №3:</h4>
				<input id="rowAmt2" type="number" value="0" style="display: none;">
				<table class="form_table" id="boxParamsTable2"><tbody>
					<tr>
						<th>№</th>
						<th>Высота</th>
						<th>Тип</th>
						<th>Удалить</th>
					</tr>
				</tbody> </table>
				
				<button class="addRow noPrint">Добавить ряд</button>
				<button class="setEqualRowHeight noPrint">Выровнять высоту</button>
			</div>

			<div class="sectRowsParams" data-sectId="3">
				<h4>2.4 Ряды секции №4:</h4>
				<input id="rowAmt3" type="number" value="0" style="display: none;">
				<table class="form_table" id="boxParamsTable3"><tbody>
					<tr>
						<th>№</th>
						<th>Высота</th>
						<th>Тип</th>
						<th>Удалить</th>
					</tr>
				</tbody> </table>
				
				<button class="addRow noPrint">Добавить ряд</button>
				<button class="setEqualRowHeight noPrint">Выровнять высоту</button>
			</div>

			<div class="sectShelfs" data-sectId="3">
				<h4>2.5 Внутренние полки:</h4>
				<input id="shelfAmt" type="number" value="0" style="display: none;">
				<table class="form_table" id="shelfParamsTable"><tbody>
					<tr>
						<th>№</th>
						<th>Секция</th>
						<th>Тип</th>
						<th>Размеры</th>
						<th>Позиция</th>
						<th>Удалить</th>
					</tr>
				</tbody> </table>
				
				<button class="addShelf noPrint">Добавить полку</button>
			</div>


			<h4>3. Технологические параметры:</h4>

			<table class="form_table"><tbody>
				<tr>
					<th>Параметр</th>
					<th>Значение:</th>
				</tr>
				<tr> 
					<td>Толстый щит</td> 
					<td><input id="thickBoardThk" type="number" value="39"></td>
				</tr>
				<tr> 
					<td>Тонкий щит</td> 
					<td><input id="thinBoardThk" type="number" value="19"></td>
				</tr>
				<tr> 
					<td>Вставки</td> 
					<td><input id="mdfThk" type="number" value="7"></td>
				</tr>

				
			</tbody> </table>

			<h4>4. Комплектация:</h4>

			<table class="form_table"><tbody>
				<tr>
					<th>Параметр</th>
					<th>Значение:</th>
				</tr>
				<tr> 
					<td>Материал каркаса</td> 
					<td>
						<select id="carcasMat_wr" size="1">
							<option value="дуб паркет.">дуб паркет.</option>
							<option value="дуб ц/л">дуб ц/л</option>
							<option value="береза паркет.">береза паркет.</option>
						</select>
					</td>
				</tr>
				<tr> 
					<td>Материал фасадов</td> 
					<td>
						<select id="doorsMat_wr" size="1">
							<option value="дуб паркет.">дуб паркет.</option>
							<option value="дуб ц/л">дуб ц/л</option>
							<option value="береза паркет.">береза паркет.</option>
						</select>
					</td>
				</tr>
				<tr> 
					<td>Материал наполнения</td> 
					<td>
						<select id="contentMat_wr" size="1">				
							<option value="дуб паркет.">дуб паркет.</option>
							<option value="дуб ц/л">дуб ц/л</option>
							<option value="береза паркет.">береза паркет.</option>
						</select>
					</td>
				</tr>
				
				<tr> 
					<td>Отделка каркаса</td> 
					<td>
						<select id="carcasPaint_wr" size="1">
							<option value="масло">масло</option>
							<option value="морилка+масло">морилка+масло</option>
							<option value="лак">лак</option>
							<option value="морилка+лак">морилка+лак</option>				
						</select>
					</td>
				</tr>
				
				<tr> 
					<td>Отделка фасадов</td> 
					<td>
						<select id="doorsPaint_wr" size="1">
							<option value="масло">масло</option>
							<option value="морилка+масло">морилка+масло</option>
							<option value="лак">лак</option>
							<option value="морилка+лак">морилка+лак</option>
						</select>
					</td>
				</tr>
				
				<tr> 
					<td>Фурнитура</td> 
					<td>
						<select id="metisType_wr" size="1">
							<option value="boyard" selected>Boyard</option>
							<option value="hettich">Hettich</option>
						</select>
					</td>
				</tr>
				
			</tbody> </table>


			Комментарии к расчету:<br/>  <textarea id="comments_wr" rows="3" cols="80" class="comments"></textarea>
			<br/>

	</div>
</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/sideboard/forms/mainFormChange.js"></script>



