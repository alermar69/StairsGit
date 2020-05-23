<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет Шкафа 1.0"); 
?>

<!-- все формы -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/main.php" ?>

<!-- Инструкции для пользователей -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "content/manual.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<div id="openDoors">Открыть дверки</div>
<p class="raschet" onclick="exportToDxf(dxfPrimitivesArr);">Экспорт контуров в dxf</p>

<!-- все скрипты -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/scripts.php" ?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>