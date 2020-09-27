<!--диалоговое окно-->

<div class="modal fade" id="offerNameFormModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Сохранение расчета в базу</h4>
			</div>

			<div class="modal-body">
				<div id="offerNameForm">

					<div style="display: none">
						Имя расчета: <input id='offerName_test' type='text'></td>
					</div>

					<table id='offerNameTab'>
						<tbody>
							<tr>
								<td>Заказ</td>
								<td></td>
								<td>Лестница</td>
								<td></td>
								<td>Геометрия</td>
								<td></td>
								<td>Расчет</td>
							</tr>
							<tr>
								<td><input id='orderId' type='number'></td>
								<td>-</td>
								<td><input id='staircaseId' type='number'></td>
								<td>-</td>
								<td><input id='geomId' type='number'></td>
								<td>-</td>
								<td><input id='complectId' type='number'></td>
							</tr>
						</tbody>
					</table>

					<!-- <button type="button" class="btn btn-primary" id="saveOffer">Сохранить</button> -->

					</br>
					Статус расчета
					<select id="status" class='offerData'>
						<option value="-">-</option>
						<option value="подписан">подписан</option>
						<option value="в работу">в работу</option>
						<option value="вероятно">вероятно</option>
						<option value="тест">тест</option>
					</select>



					<h4>Описание расчета</h4>
					Комментарий к расчету
					<textarea id="order_comment" class='offerData'></textarea>
					</br>
					Описание лестницы
					<select id="offerDataDescriptionUpdate">
						<option value="авто">авто</option>
						<option value="вручную">ввести вручную</option>
					</select>
					<textarea id="product_descr" class='offerData'></textarea>
					<br>
					</br>
					Общая сумма
					<input id='summ' type='number' class='offerData' readonly>

					</br>
					</br>

					<!-- <button type="button" class="btn btn-success" id="saveOfferData">Сохранить описание</button> -->


				</div>
				<? if ($template == 'calculator') { ?>
					<?php include $GLOBALS['ROOT_PATH'].'/calculator/general/forms/orderDataForm.php' ?>
					<!-- <div id="kp_inputs">
						<input type="number" id='currentOrderId' hidden>
						<table class="form_table">
							<tbody>
								<tr>
									<td>Номер предложения:</td>
									<td><input type="text" value="" id="orderName" readonly></td>
								</tr>
								<tr>
									<td>Дата составления:</td>
									<td><input type="date" value="2000-01-01" id="orderDate"></td>
								</tr>
								<tr>
									<td>Адрес объекта:</td>
									<td><input type="text" value="к/п Гринфилд" id="adress"></td>
								</tr>
								<tr>
									<td>Руководитель проекта:</td>
									<td><select size="1" id="managerName">
											<option value="Константин Лащиновский">Константин Лащиновский</option>
											<option value="Андрей Панков">Андрей Панков</option>
											<option value="Артур Саркисян">Артур Саркисян</option>
											<option value="Алексей Маслов">Алексей Маслов</option>
											<option value="Дубровский Сергей">Дубровский Сергей</option>
											<option value="Пилипенко Сергей">Пилипенко Сергей</option>
											<option value="Сынжерян Дмитрий">Сынжерян Дмитрий</option>
											<option value="Сергей Романов">Сергей Романов</option>
											<option value="Константин Кондратенко">Константин Кондратенко</option>
											<option value="Максим Петренко">Максим Петренко</option>
											<option value="Станислав Синельников">Станислав Синельников</option>
											<option value="Алексей Котельников">Алексей Котельников</option>
											<option value="Артем Николаев">Артем Николаев</option>
											<option value="Алексей Степин">Алексей Степин</option>
											<option value="Шерышев Сергей">Шерышев Сергей</option>
											<option value="Юркин Александр">Юркин Александр</option>

											<option value="Константин Симбирев">Константин Симбирев</option>
											<option value="Кирилл Янкин">Кирилл Янкин</option>
											<option value="Иван Русских">Иван Русских</option>
											<option value="Владислав Господариков">Владислав Господариков</option>
											<option value="Сергей Блескин">Сергей Блескин</option>
											<option value="Владимир Родионов">Владимир Родионов</option>
											<option value="Кудашкин Михаил">Кудашкин Михаил</option>
											<option value="Эдуард Мирзоян">Эдуард Мирзоян</option>
											<option value="Феликс Барсегян">Феликс Барсегян</option>
											<option value="Максим Быков">Максим Быков</option>
										</select></td>
								</tr>
								<tr>
									<td>Клиент:</td>
									<td><input type="text" value="" id="customerName"></td>
								</tr>
								<tr>
									<td>E-mail клиента:</td>
									<td><input type="text" value="" id="customerMail"></td>
								</tr>
								<tr>
									<td>Описание КП:</td>
									<td><textarea type="text" value="" id="kpDescription">Красивые и удобные лестницы по вашим размерам</textarea></td>
								</tr>
							</tbody>
						</table>
						</ul>
					</div> -->
				<? } ?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" id="saveOffer">Сохранить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->
	</div><!-- /.модальное окно-диалог -->
</div><!-- /.модальное окно -->

<!--скрипт отпарвки отчета
<script type="text/javascript" src="/bugs/sendReport2.js"></script>

<!--стили формы--
<link href="/bugs/forms/bugForm.css" type="text/css" rel="stylesheet" />
-->