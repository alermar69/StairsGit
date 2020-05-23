<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Конфигуратор резьбы v.1.0"); 
?> 

<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>
		<option value="module" >module</option>
		<option value="fire" >fire</option>	
		<option value="geometry">geometry</option>
		<option value="carving" selected>carving</option>	
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>

<!-- Форма параметров заказа-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/general/forms/orderForm.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<style type="text/css">
	
#mainImg, #riserImg {
	height: 500px;
	position: relative;
	margin-top: -80px;
}
#mainImg img {
	width: 500px;
	position: absolute;
	top: 20px;
	left: 20px;
	}

#baseRiserImg {
	width: 500px;
	position: absolute;
	top: 20px;
	left: 20px;
}

.prvImg{
	width: 250px;
	//border: 1px solid gray;
	margin: 2px;
	}

.prvImg:hover{
	border: 3px solid blue;
	}

img.selected{
	border: 2px solid blue;
	}

#riserImg_1 {
	width: 400px;
    position: absolute;
    top: 420px;
    left: 75px;
}

#riserImg_2 {
	width: 360px;
    height: 37px;
    position: absolute;
    top: 337px;
    left: 96px;
}

#riserImg_3 {
	width: 325px;
    height: 33px;
    position: absolute;
    top: 270px;
    left: 113px;
}

#riserImg_4 {
	width: 280px;
    position: absolute;
    top: 213px;
    left: 135px;
    height: 29px;
}
#riserImg_5 {
	width: 260px;
    height: 25px;
    position: absolute;
    top: 168px;
    left: 145px;
}
#riserImg_6 {
	width: 240px;
    height: 22px;
    position: absolute;
    top: 130px;
    left: 155px;
}

.moreInfo{
	text-decoration: underline;
	font-size: 0.8em;
	color: grey;
}

.moreInfo:hover{
	text-decoration: none;
	cursor: pointer;
	color: #15167d;
}
	
</style>

<h1 id = "mainTitle">Схема резного узора на лестнице</h1>


<!-- форма параметров проемов каркаса-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "forms/main_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>
<div class="carcas">
	<h3>Узоры на тетивах</h3>
	<div id="mainImg">
		<img src="/images/carving/kos_base.png" id="baseImg">
		<img src="/images/carving/kos_base.png" id="topImg">
		<img src="/images/carving/kos_base.png" id="botImg">
	</div>
</div>

<div class="risers">
	<h3>Узоры на подступенках</h3>
	<div id="riserImg">
		<img src="/images/carving/base/kos_riser_base.png" id="baseRiserImg">
		<img src="/images/carving/base/001.png" id="riserImg_1" class="riserOrnImg">
		<img src="/images/carving/base/001.png" id="riserImg_2"	class="riserOrnImg">
		<img src="/images/carving/base/001.png" id="riserImg_3"	class="riserOrnImg">
		<img src="/images/carving/base/001.png" id="riserImg_4"	class="riserOrnImg">
		<img src="/images/carving/base/001.png" id="riserImg_5"	class="riserOrnImg">
		<img src="/images/carving/base/001.png" id="riserImg_6"	class="riserOrnImg">
	</div>
</div>

</br>

<div id="imgFiles"></div>

<!-- общие библитотеки -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/general/libs_man.php",
		"EDIT_TEMPLATE" => ""
	)
);

foreach($scripts as $script){
	$printScript = true;
	if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
	if($printScript){
		echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
	};
};

?>

<script type="text/javascript" src="draw.js"></script>


<!--подгрузка ссылок на файлы узора-->
<script type="text/javascript" src="getFiles/getLinks.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>