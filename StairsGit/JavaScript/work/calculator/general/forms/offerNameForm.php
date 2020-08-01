<!--диалоговое окно-->

<div class="modal fade" id="offerNameForm">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Сохранение расчета в базу</h4>
      </div>
	  
      <div class="modal-body">
        <p>
		
			<div style="display: none">
				Имя расчета: <input id='offerName_test' type='text'></td>
			</div>
			
			<table id='offerNameTab'><tbody>
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
			</tbody></table>
			
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
			
		
		</p>
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

