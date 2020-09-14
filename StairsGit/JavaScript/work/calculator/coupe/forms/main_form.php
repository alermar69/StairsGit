<h4>1. Общие характеристики:</h4>

<table class="form_table" ><tbody>

<tr><td>Модель:</td> <td> 
	<select id="model_wr" size="1">
		<option value="классика">распашной</option>
		<option value="купе" selected >купе</option>
	</select>
</td></tr>

<tr><td>Геометрия:</td> <td> 
	<select id="geom_wr" size="1">
		<option value="прямой">прямой</option>
		<option value="угловой">угловой</option>
	</select>
</td></tr>

<tr><td>Конструкция:</td> <td> 
	<select id="type_wr" size="1">
		<option value="Отдельно стоящий">Отдельно стоящий</option>
		<option value="Встроенный">Встроенный</option>
		<option value="Раздвижная система">Раздвижная система</option>
		<option value="Тонкая настройка">Тонкая настройка</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Левая стенка:</td> <td> 
	<select id="leftWall_wr" size="1">
		<option value="боковина">боковина</option>
		<option value="фальшпанель">фальшпанель</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Правая стенка:</td> <td> 
	<select id="rightWall_wr" size="1">
		<option value="боковина">боковина</option>
		<option value="фальшпанель">фальшпанель</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Крышка:</td> <td> 
	<select id="topWall_wr" size="1">
		<option value="внутренняя">внутренняя</option>
		<option value="накладная">накладная</option>
		<option value="фальшпанель">фальшпанель</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Дно:</td> <td> 
	<select id="botWall_wr" size="1">
		<option value="цоколь">цоколь</option>
		<option value="фальшпанель">фальшпанель</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Конструкция цоколя:</td> <td> 
	<select id="botWallType" size="1">		
		<option value="внутренний короб">внутренний короб</option>
		<option value="накладной короб">накладной короб</option>
		<option value="накладная панель">накладная панель</option>
	</select>
</td></tr>

<tr class="typeConfig"><td>Задняя стенка:</td> <td> 
	<select id="rearWall_wr" size="1">
		<option value="накладная">накладная</option>
		<option value="вкладная">вкладная</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class="typeConfig"> 
	<td>Козырек</td> 
	<td><input id="topPanelOffset_wr" type="number" value="0"></td>
</tr>

<tr class="stright">
	<td>Ширина:</td> 
	<td><input id="width_wr" type="number" value="1500"></td>
</tr>

<tr class="corner">
	<td>Ширина левой сторны:</td> 
	<td><input id="leftWidth" type="number" value="1500"></td>
</tr>

<tr class="corner">
	<td>Ширина правой стороны:</td> 
	<td><input id="rightWidth" type="number" value="1500"></td>
</tr>

<tr>
	<td>Полная высота:</td> 
	<td><input id="height_wr" type="number" value="2000"></td>
</tr>


<tr class="stright">
	<td>Глубина:</td> 
	<td><input id="depth_wr" type="number" value="600"></td>
</tr>

<tr class="corner">
	<td>Глубина левой стороны:</td> 
	<td><input id="leftDept" type="number" value="600"></td>
</tr>

<tr class="corner">
	<td>Глубина правой стороны:</td> 
	<td><input id="rightDepth" type="number" value="600"></td>
</tr>

<tr>
	<td>Дополнительная секция левая:</td> 
	<td> 
		<select id="leftSect" size="1">
			<option value="нет">нет</option>
			<option value="радиусная">радиусная</option>
			<option value="треугольная">треугольная</option>
			<option value="прямая">прямая</option>			
		</select>
	</td>
</tr>

<tr class="leftSect">
	<td>Ширина левой дополнительной секции:</td> 
	<td><input id="leftSectWidth" type="number" value="600"></td>
</tr>

<tr class="leftSect">
	<td>Глубина левой дополнительной секции:</td> 
	<td><input id="leftSectDepth" type="number" value="550"></td>
</tr>

<tr class="leftSect">
	<td>Кол-во полок левой дополнительной секции:</td> 
	<td><input id="leftSectShelfAmt" type="number" value="5"></td>
</tr>



<tr>
	<td>Дополнительная секция правая:</td> 
	<td> 
		<select id="rightSect" size="1">
			<option value="нет">нет</option>
			<option value="радиусная">радиусная</option>
			<option value="треугольная">треугольная</option>
			<option value="прямая">прямая</option>						
		</select>
	</td>
</tr>

<tr class="rightSect">
	<td>Ширина правой дополнительной секции:</td> 
	<td><input id="rightSectWidth" type="number" value="600"></td>
</tr>

<tr class="rightSect">
	<td>Глубина правой дополнительной секции:</td> 
	<td><input id="rightSectDepth" type="number" value="550"></td>
</tr>

<tr class="rightSect">
	<td>Кол-во полок правой дополнительной секции:</td> 
	<td><input id="rightSectShelfAmt" type="number" value="5"></td>
</tr>







<tr class="corner"><td>Диагональ:</td> <td> 
	<select id="diagDoorType" size="1">
		<option value="прямая">прямая</option>
		<option value="выпуклая">выпуклая</option>
		<option value="вогнутая">вогнутая</option>		
	</select>
</td></tr>

<tr class="corner">
	<td>Радиус дверей:</td> 
	<td><input id="diagDoorRad" type="number" value="1500"></td>
</td></tr>


<tr><td>Верхняя накладка:</td> <td> 
	<select id="topOnlay_wr" size="1">
		<option value="нет">нет</option>
		<option value="есть">есть</option>		
	</select>
</td></tr>


</tbody> </table>

<h4>2. Комплектация:</h4>

<table class="form_table"><tbody>
	<tr>
		<th>Параметр</th>
		<th>Значение:</th>
	</tr>
	
	<tr class="rearWall"> 
		<td>Материал задней стенки</td> 
		<td>
			<select id="rearWallMat_wr" size="1">
				<option value="двп">двп</option>
				<option value="лдсп">ЛДСП</option>				
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Профильная система</td> 
		<td>
			<select id="doorProfMat_wr" size="1">				
				<option value="C">С</option>
				<option value="H">H</option>
				<option value="fusion">Fusion</option>
				<option value="flat">Flat</option>
				<option value="эконом">С эконом</option>				
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Шлегель</td> 
		<td>
			<select id="schlegel" size="1">
				<option value="есть">есть</option>
				<option value="нет">нет</option>
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Цвет шлегеля</td> 
		<td>
			<select id="schlegelColor" size="1">
				<option value="темно-серый">темно-серый</option>
				<option value="белый">белый</option>
				<option value="молочный">молочный</option>
				<option value="светло-бежевый">светло-бежевый</option>
				<option value="золото">золото</option>
				<option value="бежевый">бежевый</option>
				<option value="коричневый">коричневый</option>
				<option value="бронза">бронза</option>
				<option value="серебро">серебро</option>				
				<option value="черный">черный</option>
				
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Доводчики дверей</td> 
		<td>
			<select id="closer" size="1">
				<option value="есть">есть</option>
				<option value="нет" selected>нет</option>
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Материал каркаса</td> 
		<td>
			<select id="carcasMat" size="1">
				<option value="лдсп">ЛДСП эконом</option>
				<option value="лдсп стандарт">лдсп стандарт</option> 
				<option value="лдсп премиум">лдсп премиум</option>
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Цвет деталей каркаса</td> 
		<td><input id="carcasMatColor" type="text" value="не указан"></td>
	</tr>
	
	<tr class="rearWall"> 
		<td>Цвет задней стенки</td> 
		<td><input id="rearWallColor" type="text" value="не указан"></td>
	</tr>
	
	<tr> 
		<td>Цвет профилей дверей</td> 
		<td>
			<select id="profileColor" size="1">
				<option value="не указан">не указан</option>
				<option value="матовый хром">матовый хром</option>
				<option value="матовое золото">матовое золото</option> 
				<option value="матовая шампань">матовая шампань</option>
				<option value="матовая бронза">матовая бронза</option>
				<option value="белый глянец">белый глянец</option>
				
				<option value="блестящая шампань">блестящая шампань</option>
				<option value="блестящая бронза">блестящая бронза</option>				
				<option value="венге">венге</option>
				<option value="венге темный">венге темный</option>
				<option value="вишня">вишня</option>
				<option value="дуб дымчатый">дуб дымчатый</option>
				<option value="орех итальянский">орех итальянский</option>
				<option value="орех французский">орех французский</option>
				<option value="дуб белый">дуб белый</option>
				<option value="дуб неаполь">дуб неаполь</option>
				<option value="дуб кантри">дуб кантри</option>
				<option value="дуб серый">дуб серый</option>
				<option value="орех благородный">орех благородный</option>
				
				
			</select>
	</tr>
	
	<tr> 
		<td>Цвет вставок дверей</td> 
		<td><input id="doorPlateColor" type="text" value="не указан"></td>
	</tr>
	
	<tr> 
		<td>Выдвижные ящики</td> 
		<td>
			<select id="boxType" size="1">
				<option value="метабоксы">метабоксы</option>
				<option value="деревянные">деревянные</option>				
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Выдвижная система</td> 
		<td>
			<select id="boxRailingModel" size="1">
				<option value="Боярд эконом">Боярд эконом</option>
				<option value="Боярд премиум">Боярд премиум</option>	
				<option value="Блюм эконом">Блюм эконом</option>
				<option value="Блюм премиум">Блюм премиум</option>	
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Ручки ящиков</td> 
		<td><input id="boxHandles" type="text" value="нет"></td>
	</tr>
	
	<tr> 
		<td>Лицевая кромка</td> 
		<td>
			<select id="faceEdging" size="1">
				<option value="0">0</option>
				<option value="0.4">0.4</option>	
				<option value="1">1</option>
				<option value="2" selected>2</option>	
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Боковая кромка</td> 
		<td>
			<select id="sideEdging" size="1">
				<option value="0">0</option>
				<option value="0.4" selected>0.4</option>	
				<option value="1">1</option>
				<option value="2">2</option>	
			</select>
		</td>
	</tr>


</tbody> </table>

<h4>3. Технологические параметры:</h4>

<table class="form_table"><tbody>
	<tr>
		<th>Параметр</th>
		<th>Значение:</th>
	</tr>
	<tr> 
		<td>Толщина деталей каркаса</td> 
		<td><input id="carcasThk_wr" type="number" value="16"></td>
	</tr>
	
	<tr> 
		<td>Толщина вставок дверей из лдсп</td> 
		<td>
			<select id="doorPlateThk" size="1">
				<option value="10">10</option>
				<option value="8">8</option>
			</select>
		</td>
	</tr>
	
	<tr class="rearWall"> 
		<td>Толщина задней стенки</td> 
		<td><input id="rearWallThk_wr" type="number" value="16"></td>
	</tr>
	
	<tr class="rearWall"> 
		<td>Боковой отступ задней стенки</td> 
		<td><input id="rearWallDelta_wr" type="number" value="2"></td>
	</tr>
	
	<tr> 
		<td>Толщина фасадов</td> 
		<td><input id="doorsThk_wr" type="number" value="16"></td>
	</tr>
	
	<tr> 
		<td>Толщина дна ящика</td> 
		<td><input id="boxBotThk" type="number" value="6"></td>
	</tr>
	
	<tr>
		<td>Высота цоколя:</td> 
		<td><input id="legsHeight_wr" type="number" value="80" step="10"></td>
	</tr>
	
	<tr>
		<td>Утапливание наполнения:</td> 
		<td><input id="doorsOffset_wr" type="number" value="100" step="10"></td>
	</tr>
	<!--
	<tr>
		<td>Нахлест дверей:</td> 
		<td><input id="doorOverHang" type="number" value="20" step="1"></td>
	</tr>
	-->
	<tr> 
		<td>Зазор между боковиной ящика и стенкой</td> 
		<td><input id="boxSideGap" type="number" value="12.7"></td>
	</tr>
	
	

</tbody> </table>


Комментарии к расчету:<br/>  <textarea id="comments_wr" rows="3" cols="80" class="comments"></textarea>
<br/>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/coupe/forms/main_form_change.js"></script>


