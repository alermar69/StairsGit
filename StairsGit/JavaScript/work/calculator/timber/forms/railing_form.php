<div id="perilaFormWrap">
	<h2 class="raschet">Характеристики ограждений</h2>
	<div id="perilaForm" class="toggleDiv">
		

			<table class="form_table" ><tbody>

			<!-- параметры расположения ограждений по маршам -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/railing.php" ?>

			<tr><td>Модель ограждения:</td> <td> 
				<select id="railingModel" size="1">
					<option selected value="Деревянные балясины">Деревянные балясины</option>
					<option value="Стекло">Стекло</option>		
					<option value="Дерево с ковкой">Дерево с ковкой</option>
					
				</select>
			</td></tr>


			<!-- варианты поручней -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/handrailParams.php" ?>

			<!-- параметры деревянных ограждений -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/timber/forms/timberRailing.php" ?>

			<!-- параметры кованых ограждений -->


		<tr class="railing_tr timber_kovka_tr"><td>Модель балясины:</td> <td> 
				первая: 
				<select id="banister1" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<br/>
				вторая: 
				<select id="banister2" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<button class="showModal noPrint" data-modal="forgeModal">эскизы</button>
		</td></tr>

		<tr class="railing_tr kovka_tr timber_kovka_tr"><td>Чередование балясин:</td> <td> 
			<select id="forgeBalToggle" size="1" onchange="">
				<option value="1-1">1-1</option>
				<option value="2-1">2-1</option>
				<option value="1-2">1-2</option>
				<option value="2-2">2-2</option>
			</select>
		</td></tr>
			


			<tr class="timber_glass_tr"><td>Тип стекла:</td> <td> 
				<select id="glassType" size="1" onchange="">
					<option value="прозрачное">прозрачное</option>
					<option value="оптивайт">оптивайт</option>
					<option value="тонированное">тонированное в массе</option>
					<option value="матовое">матовое</option>
					<option value="с пленкой">с пленкой</option>
					<option value="триплекс">триплекс прозрачный</option>
					<option value="триплекс цветной">триплекс цветной</option>
				</select>
			</td></tr>

			</tbody> </table>
		<div class="priceDiv">	
			<div id="resultPerila">
				<h3 class="raschet">Стоимость ограждений:</h3>
				<p>Расчет еще не произведен.</p>
			</div>
		</div>
	</div>
</div>

			
<!--Обработчик формы--> 
<script type="text/javascript" src="/calculator/timber/forms/railing_form_change.js"></script>