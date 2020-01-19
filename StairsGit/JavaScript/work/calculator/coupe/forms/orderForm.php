<? $url = $_SERVER['REQUEST_URI'];
	//не показываем блок в разделе view
	if(!strpos($url, "view") && !strpos($url, "installation")){ ?>
	
<div class="noPrint">
<a href="/calculator/offers/" target="_blank"><img src="/images/icons/BD_find.png" width="50px"></a>
<img src="/images/icons/BD_add.png" width="50px" onclick="saveToBD('content', '/calculator/general/db_data_exchange/dataExchangeXml_2.1.php')">
<img src="/images/icons/BD_load.png" width="50px" onclick="loadFromBD('content', '/calculator/general/db_data_exchange/dataExchangeXml_2.1.php')">
</div>

<?};?>

<ul class="pz_info">
	<li>Номер предложения: <input type="text" value="" id="orderName" readonly></li>
	<li>Адрес объекта: <input type="text" value="Москва" id = "adress"></li>
	<li>Менеджер: 
		<select size="1" id="managerName">
			<option value="Эдуард Мирзоян">Эдуард Мирзоян</option>
		</select>
	</li>
</ul>