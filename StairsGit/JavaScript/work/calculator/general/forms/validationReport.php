<!-- модальное окно результат валидации -->
<div class="modal fade" id="validationReport">
	<div class="modal-dialog" role="document" style="width:700px">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Проверка данных заказа</h4>
			</div>

			<div class="modal-body">

				<table class="tab_2" style="width:100%"><tbody>
					<tr>
						<th>Параметр</th>
						<th>Условия</th>
						<th>Результат</th>
						<th>Комментарий</th>
					</tr>
					<tr>
						<td>Зафиксирована цена</td>
						<td>Режим расчета скидки установлен "цена со скидкой" вписана цена</td>
						<td id="val_priceFixed_res"></td>
						<td id="val_priceFixed"></td>
					</tr>
					<tr>
						<td>Валовка >40%</td>
						<td></td>
						<td id="val_vp_res"></td>
						<td id="val_vp"></td>
					</tr>
					<tr>
						<td>Незаполненные параметры</td>
						<td>В параметрах нигде не должно быть значений "не указано"</td>
						<td id="val_notSet_res"></td>
						<td id="val_notSet"></td>
					</tr>
					<tr>
						<td>папка заказа</td>
						<td>наличие на сервере папки данного заказа</td>
						<td id="val_folder_res"></td>
						<td id="val_folder"></td>						
					</tr>
					<tr>
						<td>Замерочник в dwg</td>
						<td>
							В папке "Техническая информация" ищутся файлы dwg, имя которых содержит "замер"
						</td>
						<td id="val_dwg_res"></td>
						<td id="val_dwg"></td>
					</tr>
					<tr>
						<td>Замерочник в pdf</td>
						<td>
							В папке "Техническая информация" ищутся файлы pdf, имя которых содержит "замер"
						</td>
						<td id="val_pdf_res"></td>
						<td id="val_pdf"></td>
					</tr>
					<tr>
						<td>Договор</td>
						<td>
							В папке "Договоры, счета, платежки" ищутся файлы pdf, ods, doc, docx имя которых содержит "договор"
						</td>
						<td id="val_doc_res"></td>
						<td id="val_doc"></td>
					</tr>
					<tr>
						<td>КП в pdf</td>
						<td>
							В папке "Договоры, счета, платежки" ищутся файлы pdf, ods, doc, docx имя которых содержит "кп"
						</td>
						<td id="val_kp_res"></td>
						<td id="val_kp"></td>
					</tr>
					<tr>
						<td>Геометрия в pdf</td>
						<td>
							В папке "Договоры, счета, платежки" ищутся файлы pdf, ods, doc, docx имя которых содержит "геом"
						</td>
						<td id="val_geom_res"></td>
						<td id="val_geom"></td>
					</tr>
					<tr>
						<td>Фото с объекта</td>
						<td>
							В папке "Фото с объекта" ищутся файлы jpg, jpeg
						</td>
						<td id="val_img_res"></td>
						<td id="val_img"></td>
					</tr>
					
				</tbody></table>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 

<!-- модальное окно сравнение расчетов-->

<div class="modal fade" id="compareReport">
	<div class="modal-dialog" role="document" style="width:700px">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Проверка данных заказа</h4>
			</div>

			<div class="modal-body">
				Что сравниваем: 
				<select id='compareType'>
					<option value="кп">кп</option>
					<option value="комплектации">комплектации</option>
				</select><br/>
				Номер расчета: <input id='originOfferId' type='text'>
				<button type="button" class="btn btn-default" id='compareOffers'>Сравнить</button>
				<br/>
				<div id="offersCompareResult"></div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 

<!-- валидация перед запуском в работу -->
<script type="text/javascript" src="/calculator/general/validation.js"></script>