<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет лестниц");
?>

<a href='/'> На главную</a>
<h1>Быстрый расчет</h1>

<!-- <div style='display: none;'> -->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>
<!-- </div> -->

<!-- модальное окно создания/редактирования письма -->
<?php include $GLOBALS['ROOT_PATH'].'/orders/mail/forms/mailModal.php' ?>

<script src="/calculator/quick_calc/main.js"></script>
<div>
	<button id="sendMessageModalShow" class="btn btn-outline-primary">Отправить КП</button>
	<div class='template-forms' style='display: none;'>
		<div class='template-link'>
			<a href="" target='_blank' id='customerLink'>Ссылка для клиента</a><br>
			<a href="" target='_blank' id='urlResultCalculator'>Ссылка</a>
		</div>
		<div id="template-inputs">
		</div>
		<div class='hidden-forms'>
			Комплектация: 
			<table class="form_table">
				<thead>
					<th>Название</th>
					<th>Описание</th>
					<th>Действие</th>
				</thead>
				<tbody>
					<tr>
						<td>Эконом</td>
						<td>каркас в порошке</td>
						<td><button class='btn btn-primary edition_button' data-edition='эконом'>Применить</button></td>
					</tr>
					<tr>
						<td>Стандартный</td>
						<td>каркас в порошке+ступени сосна без покраски+ограждение ригели</td>
						<td><button class='btn btn-primary edition_button' data-edition='стандарт'>Применить</button></td>
					</tr>
					<tr>
						<td>Премиум</td>
						<td>каркас в порошке+ступени лиственица или береза без покраски+ограждение ковка+доставка+сборка</td>
						<td><button class='btn btn-primary edition_button' data-edition='премиум'>Применить</button></td>
					</tr>
					<tr>
						<td>Премиум 2</td>
						<td>каркас в порошке+ступени дуб паркет покраска масло+ограждение Стекло на стойках+доставка+сборка</td>
						<td><button class='btn btn-primary edition_button' data-edition='премиум_2'>Применить</button></td>
					</tr>
					<tr>
						<td>Премиум 3</td>
						<td>каркас в порошке+ступени дуб цл покраска морилка+лак+ограждение самонесущее+доставка+сборка</td>
						<td><button class='btn btn-primary edition_button' data-edition='премиум_3'>Применить</button></td>
					</tr>
				</tbody>
			</table>
			<div class='template-forms'>
				<table class='form_table'>
					<thead>
						<th>Параметр</th>
						<th>Значение</th>
					</thead>
					<tbody>
						<tr class="railing_tr">
							<td>Модель ограждения:</td> <td> 
								<select class='template-modify-type' data-modify_type='railingModel' size="1">
									<option value="Ригели">Ригели</option>
									<option value="Стекло на стойках" selected >Стекло на стойках</option>
									<option value="Самонесущее стекло"  >Самонесущее стекло</option>
									<option value="Кованые балясины">Кованые балясины</option>
									<option value="Кресты">Кресты</option>
									<option style="display: none;" value="Решетка">Решетка из профиля</option>
									<option value="Трап">Трап</option>
									<option value="Экраны лазер">Экраны лазер</option>
									<option value="Деревянные балясины">Деревянные балясины</option>
									<option value="Дерево с ковкой">Дерево с ковкой</option>
									<option value="Стекло">Стекло</option>
									<option value="Реечные">Реечные</option>
								</select>
							</td>
						</tr>
						<tr class="railing_tr">
							<td>Тип дерева:</td> <td> 
								<select class='template-modify-type' data-modify_type='timberType' size="1">
									<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberTypes.php" ?>
								</select>
							</td>
						</tr>
						<tr class="railing_tr">
							<td>Покраска дерева:</td> <td> 
								<select id='timberPaint' class='modify-input' size="1">
									<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php" ?>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/assemblingForm.php" ?>
				<script src="/calculator/general/forms/assemblingFormChange.js"></script>
			</div>
		</div>
	</div>
</div>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
